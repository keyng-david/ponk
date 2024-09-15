<?php
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../db_connection.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

// Establish a database connection
$mysqli = getDbConnection();

// Function to send SSE event
function sendEvent($eventId, $data) {
    echo "id: $eventId\n";
    echo "data: $data\n\n";
    ob_flush();
    flush();
}

// Keep track of last event ID and last update time
$lastEventId = isset($_SERVER['HTTP_LAST_EVENT_ID']) ? $_SERVER['HTTP_LAST_EVENT_ID'] : 0;
$lastUpdate = time();
$keepAliveTime = time();
$sleepTime = 1;  // Start with 1 second interval

while (true) {
    // Check if client has disconnected
    if (connection_aborted()) {
        break;
    }

    // Query the game_updates table for recent changes since the last update
    $result = $mysqli->query("SELECT session_id, score FROM game_updates WHERE UNIX_TIMESTAMP(updated_at) > $lastUpdate");
    
    if ($result->num_rows > 0) {
        // Prepare batch data for multiple users
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = ['session_id' => $row['session_id'], 'score' => $row['score']];
        }

        // Send the batch event
        sendEvent($lastEventId, json_encode($data));

        // Update last update time
        $lastUpdate = time();
        $sleepTime = 1;  // Reset sleep time on update
    } else {
        // Gradually increase sleep time if no updates are detected
        $sleepTime = min($sleepTime + 1, 5);
    }

    // Keep-alive mechanism: send a comment every 30 seconds to avoid timeout
    if ((time() - $keepAliveTime) >= 30) {
        echo ": keep-alive\n\n";  // Send a comment as a keep-alive signal
        ob_flush();
        flush();
        $keepAliveTime = time();
    }

    // Sleep dynamically based on activity
    sleep($sleepTime);
}

// Close database connection
$mysqli->close();
?>