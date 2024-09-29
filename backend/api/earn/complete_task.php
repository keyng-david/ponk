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

    if (!isset($input['id'])) {
        header('HTTP/1.0 400 Bad Request');
        error_log("Error: Task ID missing in request.");
        echo json_encode(['message' => 'Task ID is required']);
        exit();
    }

    // Fetch the user associated with the session ID
    $stmtUser = $mysqli->prepare("SELECT id FROM users WHERE session_id = ?");
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

    // Log user information
    error_log("Debug: User ID: $userId");

    // Complete the task
    $taskId = $input['id'];
    error_log("Debug: Completing task with ID: $taskId");

    // Update the task as completed for the specific user and task ID
    $stmtCompleteTask = $mysqli->prepare("UPDATE user_tasks SET status = 'completed' WHERE user_id = ? AND task_id = ?");
    if (!$stmtCompleteTask) {
        throw new Exception('MySQL prepare failed for task completion query - ' . $mysqli->error);
    }

    $stmtCompleteTask->bind_param("ii", $userId, $taskId);
    if (!$stmtCompleteTask->execute()) {
        throw new Exception('MySQL execute failed for task completion - ' . $stmtCompleteTask->error);
    }

    // Check if the task was successfully marked as completed
    if ($stmtCompleteTask->affected_rows > 0) {
        // Success response, similar to task.php structure
        echo json_encode(['message' => 'Task completed successfully']);
        error_log("Debug: Task completed successfully for User ID: $userId and Task ID: $taskId");
    } else {
        echo json_encode(['message' => 'Failed to complete the task']);
        error_log("Error: Failed to complete task for User ID: $userId and Task ID: $taskId");
    }

    // Close statements
    $stmtUser->close();
    $stmtCompleteTask->close();
    $mysqli->close();
} catch (Exception $e) {
    // Log exceptions
    error_log("Exception in complete_task.php: " . $e->getMessage());
    header('HTTP/1.0 500 Internal Server Error');
    echo json_encode(['message' => 'An unexpected error occurred.']);
}