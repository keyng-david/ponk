<?php
require 'db_connection.php';

$mysqli = getDbConnection();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$sessionId = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Get sessionId from Authorization header
$sessionId = str_replace('Bearer ', '', $sessionId);

if ($requestMethod !== 'POST' || !$sessionId) {
    header('HTTP/1.0 405 Method Not Allowed');
    echo json_encode(['error' => true, 'message' => 'Method Not Allowed or Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$taskId = $input['id'];

if (!$taskId) {
    header('HTTP/1.0 400 Bad Request');
    echo json_encode(['error' => true, 'message' => 'Invalid task data']);
    exit();
}

// Find user_id based on session_id
$stmtUser = $mysqli->prepare("SELECT id FROM users WHERE session_id = ?");
$stmtUser->bind_param("s", $sessionId);
$stmtUser->execute();
$resultUser = $stmtUser->get_result();

if ($resultUser->num_rows === 0) {
    header('HTTP/1.0 404 Not Found');
    echo json_encode(['error' => true, 'message' => 'User not found']);
    exit();
}

$userData = $resultUser->fetch_assoc();
$userId = $userData['id'];

// Update `user_tasks` table to mark task as completed
$stmt = $mysqli->prepare("UPDATE user_tasks SET status = 'completed' WHERE user_id = ? AND task_id = ?");
$stmt->bind_param("ii", $userId, $taskId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['error' => false, 'message' => 'Task completed successfully']);
} else {
    echo json_encode(['error' => true, 'message' => 'Failed to complete task or task already completed']);
}

$stmt->close();
$mysqli->close();
?>