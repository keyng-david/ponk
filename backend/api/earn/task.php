<?php
require __DIR__ . '/../db_connection.php';

// Enable error reporting
ini_set('display_errors', 0); // Hide errors from output, log them instead
error_reporting(E_ALL); // Report all types of errors

try {
    $mysqli = getDbConnection();
    $sessionId = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Get sessionId from Authorization header
    $sessionId = str_replace('Session ', '', $sessionId); // Adjust for 'Session' format sent by the frontend

    // Debug log for sessionId extraction
    error_log("Debug: Received sessionId: " . ($sessionId ? $sessionId : 'None'));

    if (!$sessionId) {
        header('HTTP/1.0 401 Unauthorized');
        error_log("Error: Unauthorized access, no session ID provided.");
        echo json_encode(['error' => true, 'message' => 'Unauthorized, session ID is required']);
        exit();
    }

    // Fetch user data based on the session ID
    $stmtUser = $mysqli->prepare("SELECT id, level FROM users WHERE session_id = ?");
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
        echo json_encode(['error' => true, 'message' => 'User not found']);
        exit();
    }

    $userData = $resultUser->fetch_assoc();
    $userId = $userData['id'];
    $userLevel = $userData['level']; // Update: 'level' instead of 'user_level'

    // Debug log for user data
    error_log("Debug: Fetched user data - ID: $userId, Level: $userLevel");

    // Fetch tasks data
    $stmtTasks = $mysqli->prepare("
        SELECT 
            id, name, description, reward, reward1, reward2, reward3, reward_symbol, end_time, total_clicks, link, image_link, task_list 
        FROM tasks
    ");
    if (!$stmtTasks) {
        throw new Exception('MySQL prepare failed for tasks query - ' . $mysqli->error);
    }

    if (!$stmtTasks->execute()) {
        throw new Exception('MySQL execute failed for tasks query - ' . $stmtTasks->error);
    }

    $resultTasks = $stmtTasks->get_result();

    $tasks = [];
    while ($task = $resultTasks->fetch_assoc()) {
        // Calculate the reward based on the user level
        $rewardKey = 'reward' . $userLevel;
        $task['reward'] = isset($task[$rewardKey]) ? $task[$rewardKey] : $task['reward'];

        // Debug log for each task
        error_log("Debug: Processing task ID: " . $task['id'] . " with reward: " . $task['reward']);

        // Add each task to the tasks array, including reward1, reward2, reward3
        $tasks[] = [
            'id' => $task['id'],
            'name' => $task['name'],
            'description' => $task['description'],
            'reward' => $task['reward'],
            'reward1' => $task['reward1'],
            'reward2' => $task['reward2'],
            'reward3' => $task['reward3'],
            'reward_symbol' => $task['reward_symbol'],
            'end_time' => strtotime($task['end_time']), // Convert to timestamp
            'total_clicks' => $task['total_clicks'],
            'link' => $task['link'],
            'image_link' => $task['image_link'],
            'task_list' => json_decode($task['task_list']), // Decode JSON task list
        ];
    }

    // Debug log for total tasks fetched
    error_log("Debug: Total tasks fetched: " . count($tasks));

    // Prepare the response array
    $responseArray = [
        'error' => false,
        'payload' => [
            'tasks' => $tasks,
            'user_level' => $userLevel
        ]
    ];

    // Convert the response array to JSON
    $responseJson = json_encode($responseArray);

    // Log the response being sent
    error_log("Debug: Response sent to frontend: " . $responseJson);

    // Send the response
    echo $responseJson;

    // Close statements and database connection
    $stmtUser->close();
    $stmtTasks->close();
    $mysqli->close();
} catch (Exception $e) {
    // Log the caught error
    error_log('Exception caught in task.php: ' . $e->getMessage());

    // Respond with a generic error message to the client
    header('HTTP/1.0 500 Internal Server Error');
    echo json_encode(['error' => true, 'message' => 'An unexpected error occurred.']);

    // Close any open connections
    if (isset($stmtUser)) {
        $stmtUser->close();
    }
    if (isset($stmtTasks)) {
        $stmtTasks->close();
    }
    if (isset($mysqli)) {
        $mysqli->close();
    }
}
?>