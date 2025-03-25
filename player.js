/**
 * PLAYER OBJECT
 * @type {{playlist_index: number, init: player.init, loadPlaylist: (function(number=): [{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},null,null,null]), logError: player.logError, playlist: *[], html_videos: NodeListOf<HTMLElementTagNameMap[string]>, next_medium: null, initNext: player.initNext, playNext: player.playNext}}
 */
player = {
    
    html_videos: document.querySelectorAll('video'),
    
    playlist: [],
    
    playlist_index: 0,
    
    current_medium: null,
    
    next_medium: null,
    
    impressions: [],
    
    errors: [],
    
    /////// METHODS ////////////////////////////////////////////////////
    
    init: async function() {
        
        // EVENT LISTENERS FOR VIDEO ELEMENTS
        player.html_videos.forEach(video => {
            video.addEventListener('ended', function (e) {
                console.log('.................. ENDED');
                logger.logImpressions(player.current_medium);
                console.log(e.target.src);
                console.log(this);
                player.playNext();  // Can not use this cause it is anonymous function
            });
            
            video.addEventListener('error', function () {
                console.log('|||||||||||||||||||| ERROR loading video');
                console.log(e.target.src);
                player.playNext();  // Can not use this cause it is anonymous function
            });
        });
        
        // LOAD PLAYLIST
        await player.loadPlaylist();
        
        console.log('555555555555555555555555555555555');
        console.log(player.playlist);
        
        // FIRST RUN
        player.initNext();  // First run initialization
        
        // PLAY
        player.playNext();  // First run
    },
    
    /**
     * SET UP FIRST ELEMENT TO PLAY
     * AND PRELOADS THE RESOURCES
     */
    initNext: function() {
        try {
            console.log('Playlist:', player.playlist);
            player.next_medium = player.playlist[player.playlist_index];
            console.log('Next medium:', player.next_medium);
            
            if ( player.next_medium.type === 'video' ) {
                let video = document.querySelector('video.inactive');  // Has to be fresh instance
                video.src = player.next_medium.src;
                video.pause();
                video.currentTime = 0;
                video.classList.add('next');
            }
            else if ( player.next_medium.type === 'image' ) {
                let image = document.querySelector('img.inactive');
                image.src = player.next_medium.src;
                image.classList.add('next');
            }
            else if ( player.next_medium.type === 'template' ) {
                let iframe = document.querySelector('iframe.inactive');
                iframe.src = player.next_medium.src;
                iframe.classList.add('next');
            }
        }
        catch (e) {
            logger.logError(e);
        }
    },
    
    /**
     * THIS METHOD PLAYS NEXT ELEMENT IN THE PLAYLIST
     * HIDE PREVIOUS ELEMENT AND SHOW NEXT ELEMENT VIA CSS
     */
    playNext: function() {
        try {
            player.current_medium = player.next_medium;
            let next_element = document.querySelector('.next');
            let active_element = document.querySelector('.active');
            
            if ( player.next_medium.type === 'video' ) {
                next_element.play();
            }
            else if ( player.next_medium.type === 'image' ) {
                
                setTimeout(function () {
                    console.log('.................. IMAGE ENDED');
                    logger.logImpressions(player.current_medium);
                    player.playNext();  // Can not use this cause it is anonymous function
                }, player.next_medium.duration * 1000 - 50);  // -50 is little reserve
            }
            else if ( player.next_medium.type === 'template' ) {
                
                setTimeout(function () {
                    console.log('.................. IFRAME ENDED');
                    logger.logImpressions(player.current_medium);
                    player.playNext();  // Can not use this cause it is anonymous function
                }, player.next_medium.duration * 1000 - 50);  // -50 is little reserve
            }
            
            // CSS SHOW/HIDE
            if ( active_element ) {
                active_element.classList.add('inactive');  // Hide current element
                active_element.classList.remove('active');  // Remove active class from current element
            }
            
            next_element.classList.remove('next', 'inactive');  // Show next element
            next_element.classList.add('active');  // Set next element as active
            
            ++player.playlist_index;
            if ( player.playlist_index >= player.playlist.length ) {
                player.playlist_index = 0;
            }
            
            player.initNext();
        }
        catch (e) {
            logger.logError(e);
        }
    },
    
    /**
     * LOAD PLAYLIST FROM LOCAL SERVER
     * @param i
     * @returns {[{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},null,null,null]}
     */
    loadPlaylist: async function(i = 0) {
        try {
            const response = await axios.get('http://localhost/player/playlist.php');
            
            console.log(response.data);
            player.playlist = response.data;
            console.log(player.playlist);
        }
        catch( e ) {
            console.log(e);
            logger.logError(e, ++i)
        }
    },
}

player.init();