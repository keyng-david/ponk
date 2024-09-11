<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('HTTP/1.0 405 Method Not Allowed');
    echo json_encode(['error' => true, 'message' => 'Method Not Allowed']);
    exit();
}

try {
    // Generate a unique payload using a random UUID
    $payload = bin2hex(random_bytes(16)); // Equivalent to generating a UUID

    echo json_encode(['error' => false, 'payload' => ['payload' => $payload]]);
} catch (Exception $e) {
    error_log('Error generating payload: ' . $e->getMessage());
    header('HTTP/1.0 500 Internal Server Error');
    echo json_encode(['error' => true, 'message' => 'Internal Server Error']);
}
?>
