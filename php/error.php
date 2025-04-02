<?php

$json = file_get_contents("php://input");

$post_data = json_decode($json, true);

$errors = $post_data['errors'] ?? null;


// TODO: Store the errors to the database and then to server may be MONGODB
foreach ($errors as $e) {
    
    file_put_contents('log/error.log', date('Y-m-d H:i:s') . ' error.php' . serialize($e) . PHP_EOL, FILE_APPEND);
}

