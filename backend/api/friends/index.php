<?php
require __DIR__ . '/../db_connection.php';

$mysqli = getDbConnection();
$sessionId = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Get sessionId from Authorization header
$sessionId = str_replace('Bearer ', '', $sessionId);

if (!$sessionId) {
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(['error' => true, 'message' => 'Unauthorized, session ID is required']);
    exit();
}

// Retrieve telegram_id using session_id from "users" table
$stmt = $mysqli->prepare("SELECT telegram_id FROM users WHERE session_id = ?");
$stmt->bind_param("s", $sessionId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('HTTP/1.0 404 Not Found');
    echo json_encode(['error' => true, 'message' => 'User not found']);
    exit();
}

$user = $result->fetch_assoc();
$telegramId = $user['telegram_id'];

// Retrieve referral_link, default_reward, and premium_reward from the settings table
$stmt = $mysqli->prepare("SELECT referral_link, default_reward, premium_reward FROM settings LIMIT 1");
$stmt->execute();
$settingsResult = $stmt->get_result();
$settings = $settingsResult->fetch_assoc();

if (!$settings) {
    echo json_encode(['error' => true, 'message' => 'Settings not found']);
    exit();
}

// Append the user's telegram_id to the referral link
$referralLink = $settings['referral_link'] . '?ref=' . $telegramId;

// Query the users_friends table to get the number of referred friends and their score
$stmt = $mysqli->prepare("SELECT COUNT(*) AS friends, SUM(score) AS score FROM users_friends WHERE user_id = ?");
$stmt->bind_param("i", $telegramId);
$stmt->execute();
$friendResult = $stmt->get_result();
$friendData = $friendResult->fetch_assoc();

// Prepare the response
$response = [
    'link' => $referralLink,
    'default_reward' => $settings['default_reward'],
    'premium_reward' => $settings['premium_reward'],
    'friends' => $friendData['friends'] ?? 0,
    'score' => $friendData['score'] ?? 0
];

echo json_encode(['error' => false, 'payload' => $response]);

// Close the statements and connection
$stmt->close();
$mysqli->close();
?>