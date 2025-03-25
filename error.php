<?php

$json = file_get_contents("php://input");
$post_data = json_decode($json, true); // True zabezpečí, že to bude asociatívne pole
$errors = $post_data['errors'] ?? null;

file_put_contents('log/error.log', date('Y-m-d H:i:s') . PHP_EOL . serialize($errors) . PHP_EOL, FILE_APPEND);