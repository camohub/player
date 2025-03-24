/**
 * PLAYER OBJECT
 * @type {{playlist_index: number, init: player.init, loadPlaylist: (function(number=): [{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},null,null,null]), logError: player.logError, playlist: *[], html_videos: NodeListOf<HTMLElementTagNameMap[string]>, next_medium: null, initNext: player.initNext, playNext: player.playNext}}
 */
player = {
    
    html_videos: document.querySelectorAll('video'),
    
    playlist: [],
    
    playlist_index: 0,
    
    next_medium: null,
    
    /////// METHODS ////////////////////////////////////////////////////
    
    init: function() {
        
        // EVENT LISTENERS FOR VIDEO ELEMENTS
        this.html_videos.forEach(video => {
            video.addEventListener('ended', function (e) {
                console.log('.................. ENDED');
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
        this.loadPlaylist();
        
        // FIRST RUN
        this.initNext();  // First run initialization
        
        // PLAY
        this.playNext();  // First run
    },
    
    /**
     * SET UP FIRST ELEMENT TO PLAY
     * AND PRELOADS THE RESOURCES
     */
    initNext: function() {
        try {
            this.next_medium = this.playlist[this.playlist_index];
            console.log('Next medium:', this.next_medium);
            
            if ( this.next_medium.type === 'video' ) {
                let video = document.querySelector('video.inactive');  // Has to be fresh instance
                video.src = this.next_medium.src;
                video.pause();
                video.currentTime = 0;
                video.classList.add('next');
            }
            else if ( this.next_medium.type === 'image' ) {
                let image = document.querySelector('img.inactive');
                image.src = this.next_medium.src;
                image.classList.add('next');
            }
            else if ( this.next_medium.type === 'template' ) {
                let iframe = document.querySelector('iframe.inactive');
                iframe.src = this.next_medium.src;
                iframe.classList.add('next');
            }
        }
        catch (e) {
            this.logError(e);
        }
    },
    
    /**
     * THIS METHOD PLAYS NEXT ELEMENT IN THE PLAYLIST
     * HIDE PREVIOUS ELEMENT AND SHOW NEXT ELEMENT VIA CSS
     */
    playNext: function() {
        try {
            let next_element = document.querySelector('.next');
            let active_element = document.querySelector('.active');
            
            if ( this.next_medium.type === 'video' ) {
                next_element.play();
            }
            else if ( this.next_medium.type === 'image' ) {
                
                setTimeout(function () {
                    console.log('.................. IMAGE ENDED');
                    player.playNext();  // Can not use this cause it is anonymous function
                }, this.next_medium.duration * 1000 - 50);  // -50 is little reserve
            }
            else if ( this.next_medium.type === 'template' ) {
                
                setTimeout(function () {
                    console.log('.................. IFRAME ENDED');
                    player.playNext();  // Can not use this cause it is anonymous function
                }, this.next_medium.duration * 1000 - 50);  // -50 is little reserve
            }
            
            // CSS SHOW/HIDE
            if ( active_element ) {
                active_element.classList.add('inactive');  // Hide current element
                active_element.classList.remove('active');  // Remove active class from current element
            }
            
            next_element.classList.remove('next', 'inactive');  // Show next element
            next_element.classList.add('active');  // Set next element as active
            
            ++this.playlist_index;
            if ( this.playlist_index >= this.playlist.length ) {
                this.playlist_index = 0;
            }
            
            this.initNext();
        }
        catch (e) {
            this.logError(e);
        }
    },
    
    /**
     * LOAD PLAYLIST FROM LOCAL SERVER
     * @param i
     * @returns {[{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},{duration: number, src: string, type: string},null,null,null]}
     */
    loadPlaylist: function(i = 0) {
        
        console.log(axios);
        
        axios.get('http://localhost/player/playlist.php')
            .then(function (response) {
                console.log(response);
                this.playlist = response.data;
            })
            .catch(function (e) {
                console.log(e);
                this.logError(e, ++i)
            });
    },
    
    /**
     * LOG ERROR TO LOCAL SERVER
     * @param e
     * @param i
     */
    logError: function(e, i = 0) {
        console.error(e);
        
        axios.post('/log/player/error', {
                error: e,
            })
            .then(function (response) {
            })
            .catch(function (catch_error) {
                
                // This set up delay and max increment to prevent infinite loop
                setTimeout(function () {
                    if (i < 30) {
                        this.logError(e, ++i);  // e is not the same as catch_error
                    }
                }, 2000);
            });
    }
}

player.init();