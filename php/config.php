<?php

// Nastavíme správny Content-Type pre JSON
header('Content-Type: application/json');

$config = [
    "message_id" => "44fb1c4ea4",
    "mode" => "config",
    "content" => [
        "device" => [
            "ai" => [
                "viewership" => [
                    "ad" => false,
                    "bt" => false
                ],
                "gameStrictMode" => false,
                "skeletonOverlay" => false
            ],
            "fan" => [
                "level" => 0,
                "enabled" => false
            ],
            "ntp" => null,
            "name" => "Binarium Khadas 1742 16:9",
            "camera" => [
                "enabled" => false,
                "flipCamera" => "0",
                "rotationCamera" => "1",
                "rotationDisplay" => "1"
            ],
            "volume" => [
                "value" => 0,
                "source" => 0
            ],
            "display" => [
                "size" => [
                    "width" => "1920",
                    "height" => "1080",
                    "enabled" => true
                ],
                "offset" => [
                    "top" => null,
                    "left" => null,
                    "right" => null,
                    "bottom" => null,
                    "enabled" => false
                ],
                "density" => [
                    "value" => null,
                    "enabled" => false
                ],
                "rotation" => 0,
                "sizeInternal" => [
                    "width" => "1888",
                    "height" => "320",
                    "enabled" => true
                ]
            ],
            "commands" => [],
            "deviceID" => 1742,
            "keyboard" => [
                "space" => 0,
                "enabled" => true
            ],
            "rotation" => 0,
            "skeleton" => [
                "size" => null,
                "color" => [
                    "background" => null,
                    "onBackground" => null
                ],
                "enabled" => false
            ],
            "timezone" => "Europe/Bratislava",
            "id_server" => 1,
            "speedmeter" => 0,
            "sleep_enable" => true,
            "reboot_enable" => true,
            "skeleton_overlay" => 0
        ],
        "player" => [
            "mode" => "exo",
            "items" => [
                [
                    "id" => 0,
                    "image" => false,
                    "width" => 1248,
                    "height" => 1,
                    "static" => null
                ],
                [
                    "id" => 1,
                    "image" => false,
                    "width" => 640,
                    "height" => 1,
                    "static" => null
                ]
            ],
            "layout" => "land"
        ],
        "company" => [
            "id" => 1
        ],
        "defaults" => [
            "www" => [
                "image" => [
                    "land" => "https://lbapi.tapgest.com/lurity/image/upload//v1668605870/pwxix0ozmfwwlwzvm3e8",
                    "port" => "https://lbapi.tapgest.com/lurity/image/upload//v1652450644/pgjuw6s7lzep5nwkiras"
                ]
            ],
            "onSleep" => [
                "image" => [
                    "land" => "https://lbapi.tapgest.com/lurity/image/upload//v1668605870/pwxix0ozmfwwlwzvm3e8",
                    "port" => "https://lbapi.tapgest.com/lurity/image/upload//v1652450644/pgjuw6s7lzep5nwkiras"
                ]
            ],
            "playlist" => [
                "image" => [
                    "land" => "https://lbapi.tapgest.com/lurity/image/upload//v1668605870/pwxix0ozmfwwlwzvm3e8",
                    "port" => "https://lbapi.tapgest.com/lurity/image/upload//v1652450644/pgjuw6s7lzep5nwkiras"
                ]
            ]
        ],
        "location" => [
            "id" => 135,
            "opened" => [
                "id" => 1,
                "desc" => "Opened"
            ],
            "onSleep" => [
                "mode" => "screen"
            ],
            "opening_time" => [
                [
                    "to" => "23:30",
                    "from" => "07:00",
                    "name" => "monday",
                    "state" => 2,
                    "dayofweek" => 1
                ],
                [
                    "to" => "23:30",
                    "from" => "07:00",
                    "name" => "tuesday",
                    "state" => 2,
                    "dayofweek" => 2
                ],
                [
                    "to" => "23:30",
                    "from" => "07:00",
                    "name" => "wednesday",
                    "state" => 2,
                    "dayofweek" => 3
                ],
                [
                    "to" => "23:30",
                    "from" => "07:00",
                    "name" => "thursday",
                    "state" => 2,
                    "dayofweek" => 4
                ],
                [
                    "to" => "23:30",
                    "from" => "07:00",
                    "name" => "friday",
                    "state" => 2,
                    "dayofweek" => 5
                ],
                [
                    "to" => "23:30",
                    "from" => "07:00",
                    "name" => "saturday",
                    "state" => 2,
                    "dayofweek" => 6
                ],
                [
                    "to" => "23:30",
                    "from" => "07:00",
                    "name" => "sunday",
                    "state" => 2,
                    "dayofweek" => 7
                ]
            ]
        ],
        "template" => "advertising",
        "intervals" => [
            "alive" => 400,
            "monitoring" => 3600,
            "statistics" => 600
        ]
    ]
];

echo json_encode($config);




