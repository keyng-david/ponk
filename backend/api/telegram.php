<?php
require __DIR__ . '/db_connection.php'; 
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Telegram\Bot\Api;

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

$telegram = new Api($BOT_TOKEN);
$mysqli = getDbConnection();

// Log when connection to database is established
if ($mysqli) {
    error_log("Connected to database.");
} else {
    error_log("Failed to connect to the database.");
}

// Set webhook and add error handling
$response = $telegram->setWebhook(['url' => $SERVER_URL . '/telegram.php']);

// Handle webhook response
if ($response === true) {
    error_log("Webhook set successfully.");
} elseif ($response === false) {
    error_log("Webhook setup failed. Telegram API returned false.");
} else {
    error_log("Unexpected webhook response: " . json_encode($response));
}

// Handle /start command
$telegram->commandsHandler(true); // Using true to process the commands via webhook

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