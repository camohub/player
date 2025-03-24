<?php

file_put_contents('error.log', date('Y-m-d H:i:s') . PHP_EOL . serialize($_POST), FILE_APPEND);