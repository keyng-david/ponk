<?php
require __DIR__ . '/../../vendor/autoload.php'; // Include Composer dependencies
require __DIR__ . '/../db_connection.php';

use Phpfastcache\Helper\Psr16Adapter;

$defaultDriver = 'Files';
$cache = new Psr16Adapter($defaultDriver);

$mysqli = getDbConnection(); // Establish database connection

// Begin a database transaction to ensure atomic operations
$mysqli->begin_transaction();

try {
    foreach ($cache->getItems() as $key => $item) {
        if (strpos($key, 'user_points_') === 0) {
            $sessionId = str_replace('user_points_', '', $key);
            $points = $item->get();
            
            // Update the database using `session_id`
            $stmt = $mysqli->prepare("UPDATE users SET points = points + ? WHERE session_id = ?");
            $stmt->bind_param("is", $points, $sessionId);
            $stmt->execute();
            $stmt->close();

            // Clear the cache after updating
            $cache->delete($key);
        }
    }
    // Commit the transaction if all updates were successful
    $mysqli->commit();
} catch (Exception $e) {
    // Rollback the transaction on failure
    $mysqli->rollback();
    error_log("Failed to update points: " . $e->getMessage());
}

$mysqli->close();
?>