<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.0 405 Method Not Allowed');
    echo json_encode(['error' => true, 'message' => 'Method Not Allowed']);
    exit();
}

// Retrieve the raw POST data and decode it
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['proof'])) {
    header('HTTP/1.0 400 Bad Request');
    echo json_encode(['error' => true, 'message' => 'Bad Request - Missing required fields']);
    exit();
}

// Example validation logic
$proof = $data['proof'];
$isValid = true;  // Placeholder for proof validation logic

try {
    // Validate the proof using your custom logic
    if ($isValid) {
        echo json_encode(['error' => false, 'payload' => ['message' => 'Proof valid']]);
    } else {
        header('HTTP/1.0 400 Bad Request');
        echo json_encode(['error' => true, 'message' => 'Invalid proof']);
    }
} catch (Exception $e) {
    error_log('Error validating proof: ' . $e->getMessage());
    header('HTTP/1.0 500 Internal Server Error');
    echo json_encode(['error' => true, 'message' => 'Internal Server Error']);
}
?>
