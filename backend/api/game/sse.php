<?php
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../db_connection.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$mysqli = getDbConnection();

function sendEvent($eventId, $data) {
    echo "id: $eventId\n";
    echo "data: $data\n\n";
    ob_flush();
    flush();
}

$lastEventId = isset($_SERVER['HTTP_LAST_EVENT_ID']) ? $_SERVER['HTTP_LAST_EVENT_ID'] : 0;

while (true) {
    // Changed 'points' to 'score'
    $result = $mysqli->query("SELECT session_id, score FROM users WHERE updated_at > NOW() - INTERVAL 5 SECOND");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Changed 'points' to 'score'
            sendEvent($row['session_id'], json_encode(['session_id' => $row['session_id'], 'score' => $row['score']]));
        }
    }
    // Dynamically adjust the sleep interval to 1 second for real-time update checks
    sleep(1); // Check every 1 second
}

$mysqli->close();
?>