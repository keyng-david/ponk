<?php
require 'db_connection.php';

$mysqli = getDbConnection();
$sessionId = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Get sessionId from Authorization header
$sessionId = str_replace('Bearer ', '', $sessionId);

if (!$sessionId) {
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(['error' => true, 'message' => 'Unauthorized, session ID is required']);
    exit();
}

$stmt = $mysqli->prepare("SELECT link, friends, score, default_reward, premium_reward FROM users WHERE session_id = ?");
$stmt->bind_param("s", $sessionId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('HTTP/1.0 404 Not Found');
    echo json_encode(['error' => true, 'message' => 'User not found']);
} else {
    $userData = $result->fetch_assoc();
    echo json_encode(['error' => false, 'payload' => $userData]);
}

$stmt->close();
$mysqli->close();
?>