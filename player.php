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
        
        #video-1 {
            object-fit: fill;
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            /*width: 33% !important;
            height: 33% !important;
            max-width: 33% !important;
            max-height: 33% !important;*/
        }
        
        #video-2 {
            object-fit: fill;
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            /*left: 33%;
            width: 33% !important;
            height: 33% !important;
            max-width: 33% !important;
            max-height: 33% !important;*/
        }
        
        #image-1 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            /*top: 33%;
            left: 0;
            width: 33% !important;
            height: 33% !important;
            max-width: 33% !important;
            max-height: 33% !important;*/
        }
        
        #image-2 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            /*top: 33%;
            left: 33%;
            width: 33% !important;
            height: 33% !important;
            max-width: 33% !important;
            max-height: 33% !important;*/
        }
        
        #iframe-1 {
            position: absolute;
            border: none;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            /*top: 66%;
            left: 0;
            width: 33% !important;
            height: 33% !important;
            max-width: 33% !important;
            max-height: 33% !important;*/
        }
        
        #iframe-2 {
            position: absolute;
            border: none;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            /*top: 66%;
            left: 33%;
            width: 33% !important;
            height: 33% !important;
            max-width: 33% !important;
            max-height: 33% !important;*/
        }
        
        .inactive {
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

<div id="wrapper">
    <!-- AUTOPLAY + MUTED IS IMPORTANT FOR AUTOPLAY. OTHERWISE BROWSER BLOCK AUTOPLAY -->
    <!-- PRELOAD NEEDS TO PRELOAD THE VIDEO -->
    <video autoplay muted preload="auto" id="video-1" width="100%" height="100%" class="inactive"><div></div></video>
    
    <video autoplay muted preload="auto" id="video-2" width="100%" height="100%" class="inactive"><div></div></video>
    
    <img id="image-1" src="" width="100%" height="100%" class="inactive">
    
    <img id="image-2" src="" width="100%" height="100%" class="inactive">
    
    <iframe id="iframe-1" class="inactive"></iframe>
    
    <iframe id="iframe-2" class="inactive"></iframe>
</div>

<script src="http://localhost/player/player.js"></script>

</body>
</html>
