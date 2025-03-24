<?php

// Nastavíme správny Content-Type pre JSON
header('Content-Type: application/json');

// Vytvoríme pole s playlistom
$playlist = [
    ['src' => 'http://localhost/lurity-videos/111111.MP4', 'type' => 'video', 'duration' => 10],
    ['src' => 'http://localhost/pictures/chameleon.jpg', 'type' => 'image', 'duration' => 10],
    ['src' => 'http://localhost/lurity-videos/222222.mp4', 'type' => 'video', 'duration' => 10],
    ['src' => 'http://localhost/lurity-videos/333333.mp4', 'type' => 'video', 'duration' => 10],
    ['src' => 'https://domov.sme.sk/c/23466644/slintacka-krivacka-slovensko-vyskyt-chov.html', 'type' => 'template', 'duration' => 10],
    ['src' => 'https://www.sme.sk/', 'type' => 'template', 'duration' => 10],
    ['src' => 'http://localhost/pictures/bird.jpg', 'type' => 'image', 'duration' => 10],
    ['src' => 'http://localhost/pictures/dog.jpg', 'type' => 'image', 'duration' => 5],
];

// Vrátime playlist ako JSON (automaticky upraví formát a zakóduje ho správne)
echo json_encode($playlist);
