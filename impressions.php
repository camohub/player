<?php

$json = file_get_contents("php://input");

$post_data = json_decode($json, true);

$impressions = $post_data['impressions'] ?? [];


// TODO: Store the impressions to the database and then to server may be MONGODB
foreach ($impressions as $i) {
    
    file_put_contents('log/impressions.log', date('Y-m-d H:i:s') . PHP_EOL . serialize($i) . PHP_EOL, FILE_APPEND);
}
