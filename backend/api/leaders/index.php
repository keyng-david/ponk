<?php
require __DIR__ . '/../db_connection.php';

$mysqli = getDbConnection();

$result = $mysqli->query("SELECT telegram_id, score FROM users ORDER BY score DESC LIMIT 10");

if ($result->num_rows > 0) {
    $leaders = [];
    while ($row = $result->fetch_assoc()) {
        $leaders[] = ['username' => $row['telegram_id'], 'score' => $row['score']];
    }
    echo json_encode(['error' => false, 'payload' => ['leaders' => $leaders]]);
} else {
    echo json_encode(['error' => true, 'message' => 'No leaders found']);
}

$mysqli->close();
?>