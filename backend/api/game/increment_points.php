<?php
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../db_connection.php';

use Phpfastcache\Helper\Psr16Adapter;

// Cache Configuration
$defaultDriver = 'Files';
$cache = new Psr16Adapter($defaultDriver);

// Ensure data is being correctly decoded from JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validate the required keys exist
if (isset($data['session_id'], $data['points'])) {
    $sessionId = $data['session_id'];
    $newPoints = $data['points'];

    // Begin transaction to ensure atomic operation
    $cache->beginTransaction();
    try {
        $cachedPoints = $cache->get("user_points_{$sessionId}") ?? 0;
        $cachedPoints += $newPoints; // Increment points in cache
        
        // Set cache with new expiration of 1 minute (60 seconds)
        $cache->set("user_points_{$sessionId}", $cachedPoints, 60);
        
        // Commit transaction
        $cache->commit();
        
        echo json_encode(['status' => 'success', 'points' => $cachedPoints]);
    } catch (Exception $e) {
        // Rollback transaction on failure
        $cache->rollback();
        echo json_encode(['status' => 'error', 'message' => 'Cache update failed.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data provided.']);
    exit;
}
?>