<?php
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../db_connection.php';

use Phpfastcache\Helper\Psr16Adapter;
use Phpfastcache\Config\Config;

// Create a valid configuration object for the cache
$cacheConfig = new Config([
    'path' => __DIR__ . '/tmp/storage/cache/keyngcart.com/Files/' // Set the custom path
]);

$cache = new Psr16Adapter('Files', $cacheConfig);

// Read the raw input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Log the raw input and decoded data for debugging
error_log('increment_points.php - Raw input: ' . $input);
error_log('increment_points.php - Decoded data: ' . var_export($data, true));

// Validate the required keys
if ($data === null || !isset($data['session_id'], $data['points'])) {
    error_log('increment_points.php - Invalid input or missing session_id/points');
    echo json_encode(['status' => 'error', 'message' => 'Invalid data provided.']);
    exit;
}

$sessionId = $data['session_id'];
$newPoints = (int)$data['points']; // Ensure points are an integer

try {
    // Fetch the cached points, or default to 0 if not set
    $cachedPoints = $cache->get("user_points_{$sessionId}") ?? 0;
    error_log("increment_points.php - Fetched cached points for session_id {$sessionId}: {$cachedPoints}");

    // Increment points in cache
    $cachedPoints += $newPoints;
    error_log("increment_points.php - New points after increment for session_id {$sessionId}: {$cachedPoints}");

    // Track the keys separately, e.g., in 'user_points_keys'
    $keys = $cache->get('user_points_keys', []);
    if (!in_array("user_points_{$sessionId}", $keys)) {
        $keys[] = "user_points_{$sessionId}";
        $cache->set('user_points_keys', $keys, 60); // Save the updated key list
        error_log("increment_points.php - Added session_id {$sessionId} to keys list.");
    }

    // Set cache with new expiration of 1 minute (60 seconds)
    $cache->set("user_points_{$sessionId}", $cachedPoints, 60);
    error_log("increment_points.php - Cached points set for session_id {$sessionId} with expiration");

    echo json_encode(['status' => 'success', 'points' => $cachedPoints]);
} catch (Exception $e) {
    error_log('increment_points.php - Cache update failed: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Cache update failed.']);
    exit;
}
?>