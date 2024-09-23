<?php
require __DIR__ . '/../db_connection.php';

$mysqli = getDbConnection();
$sessionId = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; // Get sessionId from Authorization header
$sessionId = str_replace('Session ', '', $sessionId); // Adjust for 'Session' format sent by the frontend

if (!$sessionId) {
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(['error' => true, 'message' => 'Unauthorized, session ID is required']);
    exit();
}

// Fetch user data based on the session ID
$stmtUser = $mysqli->prepare("SELECT id, level FROM users WHERE session_id = ?");
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
$userLevel = $userData['user_level'];

// Fetch tasks data
$stmtTasks = $mysqli->prepare("
    SELECT 
        id, name, description, reward, reward1, reward2, reward3, reward_symbol, end_time, total_clicks, link, image_link, task_list 
    FROM tasks
");
$stmtTasks->execute();
$resultTasks = $stmtTasks->get_result();

$tasks = [];
while ($task = $resultTasks->fetch_assoc()) {
    // Calculate the reward based on the user level
    $rewardKey = 'reward' . $userLevel;
    $task['reward'] = $task[$rewardKey] ? $task[$rewardKey] : $task['reward'];

    // Add each task to the tasks array
    $tasks[] = [
        'id' => $task['id'],
        'name' => $task['name'],
        'description' => $task['description'],
        'reward' => $task['reward'],
        'reward_symbol' => $task['reward_symbol'],
        'end_time' => strtotime($task['end_time']), // Convert to timestamp
        'total_clicks' => $task['total_clicks'],
        'link' => $task['link'],
        'image_link' => $task['image_link'],
        'task_list' => json_decode($task['task_list']), // Decode JSON task list
    ];
}

// Respond with the tasks and user level
echo json_encode([
    'error' => false,
    'payload' => [
        'tasks' => $tasks,
        'user_level' => $userLevel
    ]
]);

$stmtUser->close();
$stmtTasks->close();
$mysqli->close();
?>