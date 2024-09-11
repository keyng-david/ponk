<?php
require 'vendor/autoload.php';

require 'db_connection.php';

use Phpfastcache\Helper\Psr16Adapter;

// Cache Configuration
$defaultDriver = 'Files';
$cache = new Psr16Adapter($defaultDriver);


$sessionId = $_POST['session_id'];
$newPoints = $_POST['points'];

if (isset($sessionId) && isset($newPoints)) {
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
}
?>
