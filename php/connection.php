<?php

$connection_log_path = __DIR__ . '/../log/connection.log';

file_put_contents($connection_log_path, date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND);