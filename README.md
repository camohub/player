DOKUMENTÁCIA K APLIKÁCII PLAYER
========================

Console command to run Chromium
- chrome.exe  --user-data-dir="C:\Users\Vlado" --app=http://localhost/player --start-fullscreen


Aplikácia sa skladá zo súborov
- index.php
- bootstrap.js
- config.js
- logger.js
- player.js


index.php
- súbor ktorý obsahuje html template a načíta všetky potrebné js skripty

bootstrap.js
- súbor, ktorý inicializuje js aplikáciu 
- inicializuje objekty: logger, config, player

config.js
- súbor, ktorý obsahuje konfiguračné nastavenia aplikácie, ktoré si sťahuje z lokalného servera

logger.js
- súbor, ktorý obsahuje funkcie na logovanie správ a odosielanie správ na lokálny server

player.js
- súbor, ktorý obsahuje funkcie na riadenie prehrávanie medii