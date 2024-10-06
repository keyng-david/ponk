<?php
require __DIR__ . '/db_connection.php'; 
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Telegram\Bot\Api;
use Telegram\Bot\Commands\Command;

// Debugging start
error_log("Telegram bot script initialized.");

// Load environment variables
$BOT_TOKEN = '6474304136:AAGmcXbqJR08PbTo8OcpyTuiIPhtOfgSPa8';
$SERVER_URL = 'https://keyngcart.com/api';
$FRONTEND_URL = 'https://keyngcart.com';

// Log the environment variables for debugging
error_log("BOT_TOKEN: " . ($BOT_TOKEN ? 'Loaded' : 'Missing'));
error_log("SERVER_URL: " . ($SERVER_URL ? $SERVER_URL : 'Missing'));
error_log("FRONTEND_URL: " . ($FRONTEND_URL ? $FRONTEND_URL : 'Missing'));

if (!$BOT_TOKEN || !$SERVER_URL || !$FRONTEND_URL) {
    die('BOT_TOKEN, SERVER_URL, and FRONTEND_URL must be set in the environment.');
}

// Instantiate the Telegram API
$telegram = new Api($BOT_TOKEN);
$mysqli = getDbConnection();

// Referral reward processing function
function processReferralReward($referral_telegram_id, $new_user_telegram_id, $is_premium = false) {
    global $mysqli;

    // Check if the referral is valid
    $stmt = $mysqli->prepare("SELECT telegram_id FROM users WHERE telegram_id = ?");
    $stmt->bind_param("i", $referral_telegram_id);
    $stmt->execute();
    $referring_user = $stmt->get_result()->fetch_assoc();

    if (!$referring_user) {
        return ['error' => 'Invalid referral'];
    }

    // Update the new user's referred_by column
    $stmt = $mysqli->prepare("UPDATE users SET referred_by = ? WHERE telegram_id = ?");
    $stmt->bind_param("ii", $referral_telegram_id, $new_user_telegram_id);
    $stmt->execute();

    // Get the default and premium rewards from the settings table
    $stmt = $mysqli->prepare("SELECT default_reward, premium_reward FROM settings LIMIT 1");
    $stmt->execute();
    $settings = $stmt->get_result()->fetch_assoc();

    // Rewards for direct and upliner referrer
    $level_1_reward = $settings['default_reward'];
    $premium_percentage = $settings['premium_reward'] / 100;
    $level_2_reward = $level_1_reward * $premium_percentage;

    // Add reward to the immediate referrer (Level 1)
    $stmt = $mysqli->prepare("UPDATE users SET score = score + ? WHERE telegram_id = ?");
    $stmt->bind_param("ii", $level_1_reward, $referral_telegram_id);
    $stmt->execute();

    // Check if there is a Level 2 referrer
    $stmt = $mysqli->prepare("SELECT referred_by FROM users WHERE telegram_id = ?");
    $stmt->bind_param("i", $referral_telegram_id);
    $stmt->execute();
    $level_2_referrer = $stmt->get_result()->fetch_assoc();

    if ($level_2_referrer && $level_2_referrer['referred_by']) {
        // Add reward to the Level 2 referrer
        $stmt = $mysqli->prepare("UPDATE users SET score = score + ? WHERE telegram_id = ?");
        $stmt->bind_param("ii", $level_2_reward, $level_2_referrer['referred_by']);
        $stmt->execute();
    }

    // Update or insert into the users_friends table for Level 1
    $stmt = $mysqli->prepare("INSERT INTO users_friends (user_id, friend_telegram_id, score, referral_level) 
                               VALUES (?, ?, ?, 1) 
                               ON DUPLICATE KEY UPDATE score = score + ?");
    $stmt->bind_param("iiii", $referral_telegram_id, $new_user_telegram_id, $level_1_reward, $level_1_reward);
    $stmt->execute();

    // If there is a Level 2 referrer, update or insert their record
    if ($level_2_referrer && $level_2_referrer['referred_by']) {
        $stmt = $mysqli->prepare("INSERT INTO users_friends (user_id, friend_telegram_id, score, referral_level) 
                                   VALUES (?, ?, ?, 2) 
                                   ON DUPLICATE KEY UPDATE score = score + ?");
        $stmt->bind_param("iiii", $level_2_referrer['referred_by'], $new_user_telegram_id, $level_2_reward, $level_2_reward);
        $stmt->execute();
    }

    return ['success' => 'Referral processed'];
}

// Define the StartCommand
class StartCommand extends Command
{
    protected string $name = 'start'; 
    protected string $description = 'Start command to welcome the user';

    public function handle()
    {
        global $telegram, $mysqli, $FRONTEND_URL;

        $update = $this->getUpdate();

        // Log the incoming message for debugging
        error_log("Received message: " . json_encode($update));

        // Check for query parameters for referrals
        if (isset($update['message']['text']) && strpos($update['message']['text'], '/start') === 0) {
            $query_params = explode(' ', $update['message']['text']);
            error_log("Processing /start command. Query parameters: " . json_encode($query_params));

            if (isset($query_params[1])) {
                $referral_id = $query_params[1]; // Referring user's Telegram ID
                error_log("Referral ID found: " . $referral_id);
                processReferralReward($referral_id, $update['message']['from']['id']);
            } else {
                error_log("No referral ID found.");
            }
        }

        // Check if update has a message and user ID
        if (isset($update['message']['from']['id'])) {
            $userId = $update['message']['from']['id'];
            $username = $update['message']['from']['username'] ?? null;

            $user = createUserIfNotExists($mysqli, $userId, $username);

            if ($user) {
                $sessionId = $user['session_id'] ?: createNewSessionId($mysqli, $userId);

                $frontendUrl = $FRONTEND_URL . '/?session_id=' . $sessionId;
                $keyboard = [
                    'inline_keyboard' => [
                        [['text' => '🎮 Play 🎮', 'url' => $frontendUrl]],
                        [['text' => 'Join Community', 'url' => 'https://t.me/your_community_link']],
                        [['text' => 'Follow X', 'url' => 'https://t.me/your_follow_link']],
                        [['text' => 'Guide', 'url' => 'https://t.me/your_guide_link']]
                    ]
                ];

                $telegram->sendMessage([
                    'chat_id' => $userId,
                    'text' => "🎉Hi, you are now an intern at Keyng Koin!\n💸As long as you work hard, you can earn a minimum salary of $2 daily.\n👨‍💼If you invite your friends, you can gain salary raises then. The more friends, the higher the raise!",
                    'reply_markup' => json_encode($keyboard)
                ]);
            }
        }
    }
}

// Register the StartCommand
$telegram->addCommand(StartCommand::class);

// Handle all incoming commands
$telegram->commandsHandler(true);

// Utility functions for session creation and user management

function createNewSessionId($mysqli, $telegramId) {
    $sessionId = bin2hex(random_bytes(16));
    $stmt = $mysqli->prepare("UPDATE users SET session_id = ? WHERE telegram_id = ?");
    $stmt->bind_param("si", $sessionId, $telegramId);
    $stmt->execute();
    return $sessionId;
}

function createUserIfNotExists($mysqli, $telegramId, $username) {
    $stmt = $mysqli->prepare("SELECT * FROM users WHERE telegram_id = ?");
    $stmt->bind_param("i", $telegramId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        $stmt = $mysqli->prepare("INSERT INTO users (telegram_id, username, score, level, wallet, available_clicks) VALUES (?, ?, 0, 0, '', 500)");
        $stmt->bind_param("is", $telegramId, $username);
        $stmt->execute();

        $stmt = $mysqli->prepare("SELECT * FROM users WHERE telegram_id = ?");
        $stmt->bind_param("i", $telegramId);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
    }

    return $user;
}