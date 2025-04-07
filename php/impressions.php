<?php

$impressions_log_path = __DIR__ . '/../log/impressions.log';

$json = file_get_contents("php://input");

$post_data = json_decode($json, true);

$impressions = $post_data['impressions'] ?? [];


// TODO: Store the impressions to the database and then to server may be MONGODB
foreach ($impressions as $i) {
    
    file_put_contents($impressions_log_path, date('Y-m-d H:i:s') . "\n" . json_encode($i) . PHP_EOL, FILE_APPEND);
}
