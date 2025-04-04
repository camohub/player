/**
 * PLAYER MODULE
 *
 * EVENT LISTENERS (video.ended) AND TIMEOUTS (images + iframes)
 * ARE USED TO CALL __playNext() METHOD WHICH CONTROLS THE FLOW
 *
 *
 * THE FLOW LOOKS LIKE
 * init() - first time script run
 *   - __loadPlaylist() - load playlist from server
 *   - __prepareNext() - set up next element to play
 *   - __playNext() - play next element
 *
 * LOOP
 * __playNext() - play next element
 *   - run video image or iframe
 *   - set up setTimeout() for images and iframes
 *   - __prepareNext() - set up next element to play
 *
 */
function Player(screen_config) {
    
    const self = this;
    
    self.screen_config = screen_config;
    
    self.html_wrapper_id = 'screen-' + self.screen_config.id;
    
    self.html_wrapper = null;
    
    self.html_videos = null;
    
    self.playlist = [];
    
    self.playlist_index = 0;
    
    self.current_medium = null;
    
    self.next_medium = null;
    
    /////// METHODS ////////////////////////////////////////////////////
    
    self.initHtml = function() {
        
        self.html_template = document.querySelector('.template');
        self.html_wrapper = self.html_template.cloneNode(true);
        
        // SET ID
        self.html_wrapper.id = self.html_wrapper_id;
        
        // CSS CLASS
        self.html_wrapper.classList.add('wrapper');
        self.html_wrapper.classList.add('wrapper');
        
        let prev_screen = config.config.content.player.items.find((screen) => screen.id == self.screen_config.id -1);
        let screens_count = config.config.content.player.items.length;
        
        // HTML STYLE
        self.html_wrapper.style.top = 0;
        self.html_wrapper.style.left = screens_count && prev_screen ? prev_screen.width + 'px' : 0;
        self.html_wrapper.style.width = screens_count ? self.screen_config.width + 'px' : '100%';
        
        self.html_videos = self.html_wrapper.querySelectorAll('video');
        
        document.body.appendChild(self.html_wrapper);
        
        console.log('Player.initHtml()');
        console.log(self.html_wrapper);
    }
    
    /**
     * INIT THE PLAYER WHEN SCRIPT RUNS FIRST TIME
     */
    self.init = async function(i = 0) {
        try {
            // LOAD PLAYLIST
            await self.__loadPlaylist();
            
            // EVENT LISTENERS FOR VIDEO ELEMENTS
            self.html_videos.forEach(video => {
                video.addEventListener('ended', function (e) {
                    console.log('.................. VIDEO ENDED');
                    logger.logImpression(self.current_medium);  // This is asynchronous call. It is not blocking the flow although inside the logImpressions() is await
                    self.__playNext();
                    
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log(self);
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log('+++++++++++++++++++++++++++++++++++');
                });
                
                video.addEventListener('error', function (e) {
                    console.log('|||||||||||||||||||| ERROR loading video');
                    self.__playNext();
                    logger.logError(e);
                });
            });
            
            // INIT FIRST MEDIUM
            self.__prepareNext(true);  // First run initialization
            
            // FIRST RUN
            self.__playNext(true);  // First run
            
            console.log('Player.init() +++++++++');
        }
        catch (e) {
            if ( ++i > 50 ) {  // TRY TO INIT 50 TIMES THEN LOG ERROR
                logger.logError(e);
                i = 0;
            }
            
            setTimeout(function (i) {
                self.init();
            }, 15000);
        }
    }
    
    ///////// PRIVATE METHODS /////////////////////////////////////////////
    
    /**
     * SET UP ELEMENT TO PLAY
     * AND PRELOADS NEXT RESOURCES
     * SOMETIMES NEED TO THROWS ERROR E.G. IN INIT() METHOD
     */
    self.__prepareNext = function(throw_error = false) {
        try {
            self.next_medium = self.__getMediumByIndex(self.playlist_index);
            console.log('Next medium:', self.next_medium);
            
            if ( self.next_medium.type === 'video' ) {
                let video = self.html_wrapper.querySelector('video.inactive');  // Has to be fresh instance
                video.src = self.next_medium.src;
                video.pause();
                video.currentTime = 0;
                video.classList.add('next');
            }
            else if ( self.next_medium.type === 'image' ) {
                let image = self.html_wrapper.querySelector('img.inactive');
                image.src = self.next_medium.src;
                image.classList.add('next');
            }
            else if ( self.next_medium.type === 'template' ) {
                let iframe = self.html_wrapper.querySelector('iframe.inactive');
                iframe.src = self.next_medium.src;
                iframe.classList.add('next');
            }
        }
        catch (e) {
            logger.logError(e);
            if ( throw_error ) throw e;
        }
    }
    
    /**
     * THIS METHOD PLAYS NEXT ELEMENT IN THE PLAYLIST
     * HIDE PREVIOUS ELEMENT AND SHOW NEXT ELEMENT VIA CSS
     */
    self.__playNext = function(throw_error = false) {
        try {
            self.current_medium = self.next_medium;
            let next_element = self.html_wrapper.querySelector('.next');
            let active_element = self.html_wrapper.querySelector('.active');
            
            console.log('Current medium:', self.current_medium);
            
            if ( self.next_medium.type === 'video' ) {
                next_element.play();
            }
            else if ( self.next_medium.type === 'image' ) {
                
                setTimeout(function () {
                    console.log('.................. IMAGE ENDED');
                    logger.logImpression(self.current_medium);
                    
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log(self);
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log('+++++++++++++++++++++++++++++++++++');
                    
                    self.__playNext();
                }, self.next_medium.duration * 1000 - 20);  // -20 is little reserve
            }
            else if ( self.next_medium.type === 'template' ) {
                
                setTimeout(function () {
                    console.log('.................. IFRAME ENDED');
                    logger.logImpression(self.current_medium);
                    
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log(self);
                    console.log('+++++++++++++++++++++++++++++++++++');
                    console.log('+++++++++++++++++++++++++++++++++++');
                    
                    self.__playNext();
                }, self.next_medium.duration * 1000 - 20);  // -20 is little reserve
            }
            
            // CSS SHOW/HIDE
            if ( active_element ) {
                active_element.classList.add('inactive');  // Hide current element
                active_element.classList.remove('active');  // Remove active class from current element
            }
            
            next_element.classList.remove('next', 'inactive');  // Show next element
            next_element.classList.add('active');  // Set next element as active
            
            ++self.playlist_index;
            if ( self.playlist_index >= self.playlist.length ) {
                self.playlist_index = 0;
            }
            
            self.__prepareNext();
        }
        catch (e) {
            logger.logError(e);
            if ( throw_error ) throw e;
        }
    }
    
    /**
     * LOAD PLAYLIST FROM LOCAL SERVER
     */
    self.__loadPlaylist = async function() {
        try {
            const response = await axios.get('http://localhost/player/php/playlist.php');
            
            self.playlist = response.data;
            
            let now = self.__getCurrentTime();
            
            // FIND INDEX OF THE FIRST ELEMENT TO PLAY ACCORDING TO CURRENT TIME.
            let now_idx = self.playlist.content.playlist.time.findIndex((time, idx) => time < now);
            
            self.playlist_index = now_idx > 0 ? now_idx : 0;
        }
        catch( e ) {
            logger.logError(e);
            throw e;
        }
    }
    
    self.__getMediumByIndex = function (idx) {
        let playlist_item_id = self.playlist.content.playlist.item_id[idx];
        let playlist_item = self.playlist.content.items.find((item) => item.item_id === playlist_item_id);
        
        let medium = {
            type: playlist_item.content_type,
            src: playlist_item.body.video ? playlist_item.body.video : playlist_item.body.image,
            duration: playlist_item.duration,
            screen_id: playlist_item.screen_id
        }
        
        return medium;
    }
    
    self.__getCurrentTime = function() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}`;
    }
}