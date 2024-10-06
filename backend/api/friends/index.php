<?php
require __DIR__ . '/../db_connection.php';

$mysqli = getDbConnection();
$sessionId = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Get sessionId from Authorization header
$sessionId = str_replace('Bearer ', '', $sessionId);

// Log session ID for debugging
error_log("Session ID: " . $sessionId);

if (!$sessionId) {
    error_log("Unauthorized request: Missing session ID");
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(['error' => true, 'message' => 'Unauthorized, session ID is required']);
    exit();
}

// Retrieve telegram_id using session_id from "users" table
$stmt = $mysqli->prepare("SELECT telegram_id FROM users WHERE session_id = ?");
$stmt->bind_param("s", $sessionId);
$stmt->execute();
$result = $stmt->get_result();

// Log if user is not found
if ($result->num_rows === 0) {
    error_log("User not found for session ID: " . $sessionId);
    header('HTTP/1.0 404 Not Found');
    echo json_encode(['error' => true, 'message' => 'User not found']);
    exit();
}

$user = $result->fetch_assoc();
$telegramId = $user['telegram_id'];

// Log telegram ID
error_log("User found. Telegram ID: " . $telegramId);

// Retrieve referral_link, default_reward, and premium_reward from the settings table
$stmt = $mysqli->prepare("SELECT referral_link, default_reward, premium_reward FROM settings LIMIT 1");
$stmt->execute();
$settingsResult = $stmt->get_result();
$settings = $settingsResult->fetch_assoc();

if (!$settings) {
    error_log("Settings not found");
    echo json_encode(['error' => true, 'message' => 'Settings not found']);
    exit();
}

// Log settings data
error_log("Settings: " . json_encode($settings));

// Append the user's telegram_id to the referral link
$referralLink = $settings['referral_link'] . '?start=' . $telegramId;
error_log("Referral link: " . $referralLink);

$stmt = $mysqli->prepare("SELECT id FROM users WHERE telegram_id = ?");
$stmt->bind_param("i", $telegramId);
$stmt->execute();
$userResult = $stmt->get_result();
$userData = $userResult->fetch_assoc();
$userId = $userData['id'];

// Log if user ID is found
error_log("User ID for referral query: " . $userId);

// Now, retrieve the number of friends and their score from users_friends using the correct user ID
$stmt = $mysqli->prepare("SELECT COUNT(*) AS friends, SUM(score) AS score FROM users_friends WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$friendResult = $stmt->get_result();
$friendData = $friendResult->fetch_assoc();

// Log friend and score data
error_log("Friend data: " . json_encode($friendData));

// Prepare the response
$response = [
    'link' => $referralLink,
    'default_reward' => $settings['default_reward'],
    'premium_reward' => $settings['premium_reward'],
    'friends' => $friendData['friends'] ?? 0,
    'score' => $friendData['score'] ?? 0
];

// Log final response
error_log("Response payload: " . json_encode($response));

echo json_encode(['error' => false, 'payload' => $response]);

// Close the statements and connection
$stmt->close();
$mysqli->close();
?>