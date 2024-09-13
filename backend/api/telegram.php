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

// Define the StartCommand
class StartCommand extends Command
{
    // Type hint for $name
    protected string $name = 'start'; 
    protected string $description = 'Start command to welcome the user';

    public function handle()
    {
        global $telegram, $mysqli, $FRONTEND_URL; // Use global variables

        $update = $this->getUpdate();

        // Log the update for debugging
        error_log("Received update: " . json_encode($update));

        // Check if update has a message and user ID
        if (isset($update['message']['from']['id'])) {
            $userId = $update['message']['from']['id'];
            error_log("User ID: " . $userId);
        } else {
            error_log("No user ID found in update.");
            return;
        }

        // Log before checking the user in the database
        error_log("Checking if user exists or creating new user...");

        $user = createUserIfNotExists($mysqli, $userId);

        if ($user) {
            error_log("User found or created: " . json_encode($user));
            $sessionId = $user['session_id'] ?: createNewSessionId($mysqli, $userId);
            error_log("Session ID: " . $sessionId);

            $frontendUrl = $FRONTEND_URL . '/?session_id=' . $sessionId;
            $keyboard = [
                'inline_keyboard' => [
                    [['text' => '🎮 Play 🎮', 'url' => $frontendUrl]],
                    [['text' => 'Join Community', 'url' => 'https://t.me/your_community_link']],
                    [['text' => 'Follow X', 'url' => 'https://t.me/your_follow_link']],
                    [['text' => 'Guide', 'url' => 'https://t.me/your_guide_link']]
                ]
            ];

            // Log before sending message
            error_log("Sending message to user with ID: " . $userId);

            $telegram->sendMessage([
                'chat_id' => $userId,
                'text' => "🎉Hi, you are now an intern at Keyng Koin!\n💸As long as you work hard, you can earn a minimum salary of $2 daily.\n👨‍💼If you invite your friends, you can gain salary raises then. The more friends, the higher the raise!",
                'reply_markup' => json_encode($keyboard)
            ]);
        } else {
            error_log("User creation failed or something went wrong.");
            $telegram->sendMessage(['chat_id' => $userId, 'text' => "Sorry, something went wrong. Please try again later."]);
        }
    }
}

// Register the StartCommand
$telegram->addCommand(StartCommand::class);

// Handle all incoming commands
$telegram->commandsHandler(true); // Corrected to pass a boolean value

function createNewSessionId($mysqli, $telegramId) {
    $sessionId = bin2hex(random_bytes(16));
    $stmt = $mysqli->prepare("UPDATE users SET session_id = ? WHERE telegram_id = ?");

    if (!$stmt) {
        error_log("Failed to prepare statement for session ID: " . $mysqli->error);
        return false;
    }

    $stmt->bind_param("si", $sessionId, $telegramId);
    if (!$stmt->execute()) {
        error_log("Failed to execute statement for session ID: " . $stmt->error);
        return false;
    }

    $stmt->close();
    error_log("Session ID created: " . $sessionId);
    return $sessionId;
}

function createUserIfNotExists($mysqli, $telegramId) {
    $stmt = $mysqli->prepare("SELECT * FROM users WHERE telegram_id = ?");

    if (!$stmt) {
        error_log("Failed to prepare select statement: " . $mysqli->error);
        return false;
    }

    $stmt->bind_param("i", $telegramId);
    if (!$stmt->execute()) {
        error_log("Failed to execute select statement: " . $stmt->error);
        return false;
    }

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        error_log("User not found. Creating a new user...");
        $stmt = $mysqli->prepare("INSERT INTO users (telegram_id, score, level, wallet, available_clicks) VALUES (?, 0, 0, '', 500)");

        if (!$stmt) {
            error_log("Failed to prepare insert statement: " . $mysqli->error);
            return false;
        }

        $stmt->bind_param("i", $telegramId);
        if (!$stmt->execute()) {
            error_log("Failed to execute insert statement: " . $stmt->error);
            return false;
        }

        $stmt->close();

        // Retrieve the newly inserted user
        $stmt = $mysqli->prepare("SELECT * FROM users WHERE telegram_id = ?");
        if (!$stmt) {
            error_log("Failed to prepare select statement after insert: " . $mysqli->error);
            return false;
        }

        $stmt->bind_param("i", $telegramId);
        if (!$stmt->execute()) {
            error_log("Failed to execute select statement after insert: " . $stmt->error);
            return false;
        }

        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        error_log("New user created: " . json_encode($user));
    } else {
        error_log("User exists: " . json_encode($user));
    }

    return $user;
}