<?php
require __DIR__ . '/../db_connection.php';

ini_set('display_errors', 0); // Hide errors from output, log them instead
error_reporting(E_ALL); // Enable error logging

try {
    $mysqli = getDbConnection();
    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $sessionId = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Get sessionId from Authorization header
    $sessionId = str_replace('Session ', '', $sessionId); // Adjust for 'Session' format sent by the frontend

    // Log request method and session ID
    error_log("Debug: Request method: $requestMethod, Session ID: " . ($sessionId ?: 'None'));

    if ($requestMethod !== 'POST' || !$sessionId) {
        header('HTTP/1.0 405 Method Not Allowed');
        error_log("Error: Invalid request method or missing session ID.");
        echo json_encode(['message' => 'Method Not Allowed or Unauthorized']);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);

    // Log input data
    error_log("Debug: Input data: " . json_encode($input));

    if (!isset($input['id']) || !isset($input['reward'])) {
        header('HTTP/1.0 400 Bad Request');
        error_log("Error: Task ID or reward missing in request.");
        echo json_encode(['message' => 'Task ID and reward are required']);
        exit();
    }

    $taskId = $input['id'];
    $reward = (int)$input['reward'];

    // Fetch the user associated with the session ID
    $stmtUser = $mysqli->prepare("SELECT id, score FROM users WHERE session_id = ?");
    if (!$stmtUser) {
        throw new Exception('MySQL prepare failed for user query - ' . $mysqli->error);
    }

    $stmtUser->bind_param("s", $sessionId);
    if (!$stmtUser->execute()) {
        throw new Exception('MySQL execute failed for user query - ' . $stmtUser->error);
    }

    $resultUser = $stmtUser->get_result();
    if ($resultUser->num_rows === 0) {
        header('HTTP/1.0 404 Not Found');
        error_log("Error: User not found for session ID: " . $sessionId);
        echo json_encode(['message' => 'User not found']);
        exit();
    }

    $userData = $resultUser->fetch_assoc();
    $userId = $userData['id'];
    $currentScore = $userData['score'];

    // Log user information
    error_log("Debug: User ID: $userId, Current Score: $currentScore");

    // Update the user's score by adding the reward
    $newScore = $currentScore + $reward;
    $stmtUpdate = $mysqli->prepare("UPDATE users SET score = ? WHERE id = ?");
    if (!$stmtUpdate) {
        throw new Exception('MySQL prepare failed for score update - ' . $mysqli->error);
    }

    $stmtUpdate->bind_param("ii", $newScore, $userId);
    if (!$stmtUpdate->execute()) {
        throw new Exception('MySQL execute failed for score update - ' . $stmtUpdate->error);
    }

    // Insert task completion in the user_tasks table
    $stmtTask = $mysqli->prepare("INSERT INTO user_tasks (user_id, task_id, status) VALUES (?, ?, 'completed')");
    if (!$stmtTask) {
        throw new Exception('MySQL prepare failed for task insert - ' . $mysqli->error);
    }

    $stmtTask->bind_param("ii", $userId, $taskId);
    if (!$stmtTask->execute()) {
        throw new Exception('MySQL execute failed for task insert - ' . $stmtTask->error);
    }

    // Send response back to the client
    echo json_encode([
        'message' => 'Task completed successfully',
        'new_score' => $newScore
    ]);

} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    header('HTTP/1.0 500 Internal Server Error');
    echo json_encode(['message' => 'An error occurred while processing the request']);
} finally {
    if (isset($stmtUser)) {
        $stmtUser->close();
    }
    if (isset($stmtUpdate)) {
        $stmtUpdate->close();
    }
    if (isset($stmtTask)) {
        $stmtTask->close();
    }
    $mysqli->close();
}
?>