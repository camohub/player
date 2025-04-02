<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="robots" content="noindex">
	<meta name="generator" content="Tracy by Nette Framework">

	<title>Player</title>
	
	<style>
        *, *::before, *::after {
            box-sizing: border-box;
        }
        
        html, body {
            height: 100%;
            width: 100%;
            position: relative;
            padding: 0;
            margin: 0;
        }
        
        .template {
            position: relative;
        }
        
        .wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
        }
        
        .wrapper .video-1 {
            object-fit: fill;
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
        }

        .wrapper .video-2 {
            object-fit: fill;
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
        }

        .wrapper .image-1 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
        }

        .wrapper .image-2 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
        }

        .wrapper .iframe-1 {
            position: absolute;
            border: none;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
        }

        .wrapper .iframe-2 {
            position: absolute;
            border: none;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
        }

        .wrapper .inactive {
            display: none;
        }
        
        .active {
            display: block;
            /*border-bottom: 4px solid green;*/
        }

        .next {
            /*border-bottom: 4px solid orange;*/
        }
    </style>
    
	<!--<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>-->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>

<body>

<!-- TEMPLATE IS USED BY Config TO CREATE PLAYER. IT TAKES WHOLE HTML AND CREATE NOW .wrapper NODE FOR EACH SCREEN. -->
<div class="template">
    <!-- AUTOPLAY + MUTED IS IMPORTANT FOR AUTOPLAY. OTHERWISE BROWSER BLOCK AUTOPLAY -->
    <!-- PRELOAD NEEDS TO PRELOAD THE VIDEO -->
    <video autoplay muted preload="auto" width="100%" height="100%" class="video-1 inactive"><div></div></video>
    
    <video autoplay muted preload="auto" width="100%" height="100%" class="video-2 inactive"><div></div></video>
    
    <img src="" width="100%" height="100%" class="image-1 inactive">
    
    <img src="" width="100%" height="100%" class="image-2 inactive">
    
    <iframe class="iframe-1 inactive"></iframe>
    
    <iframe class="iframe-2 inactive"></iframe>
</div>

<script src="http://localhost/player/js/logger.js"></script>
<script src="http://localhost/player/js/player.js"></script>
<script src="http://localhost/player/js/config.js"></script>
<script src="http://localhost/player/js/bootstrap.js"></script>

</body>
</html>
