<?php

$error_lof_path = __DIR__ . '/../log/error.log';

$json = file_get_contents("php://input");

$post_data = json_decode($json, true);

$errors = $post_data['errors'] ?? null;

// TODO: Store the errors to the database and then to server may be MONGODB
foreach ($errors as $e) {
    
    file_put_contents($error_lof_path, date('Y-m-d H:i:s') . " PLAYER ERROR\n" . json_encode($e) . PHP_EOL, FILE_APPEND);
}

