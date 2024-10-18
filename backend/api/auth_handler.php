<?php
require __DIR__ . '/db_connection.php';
require_once __DIR__ . '/../vendor/autoload.php';

$mysqli = getDbConnection();
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Ensure request is POST
if ($requestMethod !== 'POST') {
    header('Content-Type: application/json');
    header('HTTP/1.0 405 Method Not Allowed');
    echo json_encode(['error' => true, 'message' => 'Method Not Allowed']);
    exit();
}

// Decode JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if 'session_id' is provided in the JSON input
if (!isset($input['sessionId'])) {
    header('Content-Type: application/json');
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(['error' => true, 'message' => 'Unauthorized, session ID is required']);
    exit();
}

$sessionId = $input['sessionId'];

// Prepare SQL statement and check for errors
$stmt = $mysqli->prepare("SELECT score, available_clicks, wallet, level, username FROM users WHERE session_id = ?");
if ($stmt === false) {
    header('Content-Type: application/json');
    header('HTTP/1.0 500 Internal Server Error');
    echo json_encode(['error' => true, 'message' => 'Failed to prepare the statement']);
    exit();
}

$stmt->bind_param("s", $sessionId);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists and return appropriate response
if ($result->num_rows === 0) {
    header('Content-Type: application/json');
    header('HTTP/1.0 404 Not Found');
    echo json_encode(['error' => true, 'message' => 'User not found']);
} else {
    $userData = $result->fetch_assoc();
    header('Content-Type: application/json');
    echo json_encode(['error' => false, 'payload' => $userData]);
}

// Clean up resources
$stmt->close();
$mysqli->close();
?>