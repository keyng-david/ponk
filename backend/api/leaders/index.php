<?php
require __DIR__ . '/../db_connection.php';

$mysqli = getDbConnection();

// 1. Extract the session ID from the Authorization header
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    echo json_encode(['error' => true, 'message' => 'Authorization header missing']);
    http_response_code(401);
    exit;
}

$authHeader = $headers['Authorization'];
list($type, $sessionId) = explode(' ', $authHeader);

if ($type !== 'Bearer' || empty($sessionId)) {
    echo json_encode(['error' => true, 'message' => 'Invalid Authorization header']);
    http_response_code(401);
    exit;
}

// 2. Validate the session and get the user ID
// Assuming you have a sessions table or a way to validate the session ID
// Here we'll assume a function getUserIdBySessionId($sessionId) that returns the user ID
function getUserIdBySessionId($sessionId) {
    // Implement this function according to your session management
    // For demonstration, let's assume it returns a user ID or null
    global $mysqli;
    $stmt = $mysqli->prepare("SELECT user_id FROM sessions WHERE session_id = ?");
    $stmt->bind_param("s", $sessionId);
    $stmt->execute();
    $stmt->bind_result($userId);
    if ($stmt->fetch()) {
        return $userId;
    } else {
        return null;
    }
}

$userId = getUserIdBySessionId($sessionId);

if (!$userId) {
    echo json_encode(['error' => true, 'message' => 'Invalid session']);
    http_response_code(401);
    exit;
}

// 3. Get the user's data (username and score)
$stmt = $mysqli->prepare("SELECT username, score FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($username, $userScore);
if (!$stmt->fetch()) {
    echo json_encode(['error' => true, 'message' => 'User not found']);
    http_response_code(404);
    exit;
}
$stmt->close();

// 4. Calculate the user's position in the leaderboard
// We'll use a query to find the user's rank based on their score
$stmt = $mysqli->prepare("
    SELECT COUNT(*) + 1 AS position
    FROM users
    WHERE score > (
        SELECT score FROM users WHERE id = ?
    )
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($userPosition);
$stmt->fetch();
$stmt->close();

// 5. Get the top 10 leaders
$result = $mysqli->query("SELECT username, score FROM users ORDER BY score DESC LIMIT 10");

$leaders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $leaders[] = [
            'username' => $row['username'],
            'score' => (int)$row['score']
        ];
    }
}

// 6. Prepare the user's data
$userLeaderData = [
    'position' => (int)$userPosition,
    'username' => $username,
    'score' => (int)$userScore
];

// 7. Return the response
echo json_encode([
    'error' => false,
    'payload' => [
        'leaders' => $leaders,
        'userLeaderData' => $userLeaderData
    ]
]);

$mysqli->close();
?>