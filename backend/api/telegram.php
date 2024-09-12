<?php
require __DIR__ . '/db_connection.php'; 
require 'vendor/autoload.php';

use Telegram\Bot\Api;

$BOT_TOKEN = getenv('BOT_TOKEN');
$SERVER_URL = getenv('SERVER_URL');
$FRONTEND_URL = getenv('FRONTEND_URL');

if (!$BOT_TOKEN || !$SERVER_URL || !$FRONTEND_URL) {
    die('BOT_TOKEN, SERVER_URL, and FRONTEND_URL must be set in the environment.');
}

$telegram = new Api($BOT_TOKEN);
$mysqli = getDbConnection();

// Retrieve webhook update and handle /start command
$update = $telegram->getWebhookUpdate();
$message = $update->getMessage();

if ($message && strtolower($message->getCommand()) === 'start') {
    $userId = $message->getFrom()->getId();
    $user = createUserIfNotExists($mysqli, $userId);

    if ($user) {
        $sessionId = $user['session_id'] ?: createNewSessionId($mysqli, $userId);

        $frontendUrl = $FRONTEND_URL . '/?session_id=' . $sessionId;
        $keyboard = [
            'inline_keyboard' => [
                [['text' => '💎 Play 💎', 'url' => $frontendUrl]],
                [['text' => 'Join Community', 'url' => 'https://t.me/your_community_link']],
                [['text' => 'Follow X', 'url' => 'https://t.me/your_follow_link']],
                [['text' => 'Guide', 'url' => 'https://t.me/your_guide_link']]
            ]
        ];

        $telegram->sendMessage([
            'chat_id' => $userId,
            'text' => "🎉Hi, you are now an intern at Keyng Koin!\n💲As long as you work hard, you can earn a minimum salary of $2 daily.\n👫If you invite your friends, you can gain salary raises then. The more friends, the higher the raise!",
            'reply_markup' => json_encode($keyboard)
        ]);
    } else {
        $telegram->sendMessage(['chat_id' => $userId, 'text' => "Sorry, something went wrong. Please try again later."]);
    }
}

// Ensure we return a valid response to Telegram
http_response_code(200);
echo 'OK';

/**
 * Create a new session ID for the user if not exists.
 */
function createNewSessionId($mysqli, $telegramId) {
    $sessionId = bin2hex(random_bytes(16));
    $stmt = $mysqli->prepare("UPDATE users SET session_id = ? WHERE telegram_id = ?");
    $stmt->bind_param("si", $sessionId, $telegramId);
    $stmt->execute();
    $stmt->close();
    return $sessionId;
}

/**
 * Create a user if they do not already exist in the database.
 */
function createUserIfNotExists($mysqli, $telegramId) {
    $stmt = $mysqli->prepare("SELECT * FROM users WHERE telegram_id = ?");
    $stmt->bind_param("i", $telegramId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        // Insert a new user
        $stmt = $mysqli->prepare("INSERT INTO users (telegram_id, score, level, wallet, available_clicks) VALUES (?, 0, 0, '', 500)");
        $stmt->bind_param("i", $telegramId);
        $stmt->execute();
        $stmt->close();

        // Fetch the newly created user
        $stmt = $mysqli->prepare("SELECT * FROM users WHERE telegram_id = ?");
        $stmt->bind_param("i", $telegramId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
    }

    return $user;
}