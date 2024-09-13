<?php
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

function getDbConnection() {
    $host = 'localhost';
    $user = 'taahquzo_game';
    $pass = 'ETMinds.1';
    $db = 'taahquzo_game';
    $mysqli = new mysqli($host, $user, $pass, $db);

    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    return $mysqli;
}
?>