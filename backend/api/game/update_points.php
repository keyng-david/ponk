<?php
require __DIR__ . '/../../vendor/autoload.php'; // Include Composer dependencies
require __DIR__ . '/../db_connection.php';

use Phpfastcache\Helper\Psr16Adapter;
use Phpfastcache\Config\Config;

// Create a valid configuration object for the cache
$cacheConfig = new Config([
    'path' => __DIR__ . '/tmp/storage/cache/keyngcart.com/Files/' // Set the custom path
]);

$cache = new Psr16Adapter('Files', $cacheConfig);

$mysqli = getDbConnection(); // Establish database connection

// Log for debugging
error_log("update_points.php - Starting to update points from cache");

// Begin a database transaction to ensure atomic operations
$mysqli->begin_transaction();

try {
    // Retrieve the list of all keys from the 'user_points_keys'
    $keys = $cache->get('user_points_keys', []);

    foreach ($keys as $key) {
        $item = $cache->get($key);
        if ($item) {
            $sessionId = str_replace('user_points_', '', $key);
            $points = (int)$item;

            // Log retrieved points for the session
            error_log("update_points.php - Retrieved {$points} points for session_id {$sessionId}");

            // Debug: Log session_id and points before update
            error_log("update_points.php - Preparing to update session_id: {$sessionId} with points: {$points}");

            // Update the database using `session_id`
            $stmt = $mysqli->prepare("UPDATE users SET score = score + ? WHERE session_id = ?");
            $stmt->bind_param("is", $points, $sessionId);

            // Debug: Check SQL execution status
            if ($stmt->execute()) {
                error_log("update_points.php - Successfully updated score for session_id {$sessionId}");
            } else {
                error_log("update_points.php - Failed to update score for session_id {$sessionId}. SQL Error: " . $stmt->error);
            }

            $stmt->close();

            // Clear the cache after updating
            $cache->delete($key);
            error_log("update_points.php - Cleared cache for session_id {$sessionId}");
        }
    }

    // Commit the transaction if all updates were successful
    $mysqli->commit();
    error_log("update_points.php - Transaction committed successfully");

    // Cleanup: Clear the tracked keys
    $cache->delete('user_points_keys');
    error_log("update_points.php - Cleared all cached keys.");

} catch (Exception $e) {
    // Rollback the transaction on failure
    $mysqli->rollback();
    error_log("update_points.php - Transaction failed and rolled back: " . $e->getMessage());
}

$mysqli->close();
error_log("update_points.php - Database connection closed");
?>