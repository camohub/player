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
    
    self.timeout = null;
    
    /////// METHODS ////////////////////////////////////////////////////
    
    self.initHtml = function() {
        
        self.html_template = document.querySelector('.template');
        self.html_wrapper = self.html_template.cloneNode(true);
        
        // SET ID
        self.html_wrapper.id = self.html_wrapper_id;
        
        // CSS CLASS
        self.html_wrapper.classList.add('wrapper');
        self.html_wrapper.classList.remove('template');
        
        let prev_screen = config.config.content.player.items.find((screen) => screen.id == self.screen_config.id -1);
        let screens_count = config.config.content.player.items.length;
        
        // HTML STYLE
        self.html_wrapper.style.top = 0;
        self.html_wrapper.style.left = screens_count && prev_screen ? prev_screen.width + 'px' : 0;
        self.html_wrapper.style.width = screens_count ? self.screen_config.width + 'px' : '100%';
        
        self.html_videos = self.html_wrapper.querySelectorAll('video');
        
        document.body.appendChild(self.html_wrapper);
        
        console.log('+++++++++ Player.initHtml()');
        console.log(self.html_wrapper);
    }
    
    /**
     * INIT THE PLAYER WHEN SCRIPT RUNS FIRST TIME
     */
    self.init = async function(i = 0) {
        try {
            // LOAD PLAYLIST
            await __loadPlaylist();
            
            // EVENT LISTENERS FOR VIDEO ELEMENTS
            self.html_videos.forEach(video => {
                video.addEventListener('ended', function (e) {
                    console.log('.................. VIDEO ENDED ' + self.current_medium.campaign_id);
                    logger.logImpression(self.current_medium);  // This is asynchronous call. It is not blocking the flow although inside the logImpressions() is await
                    __playNext();
                });
                
                video.addEventListener('error', function (e) {
                    console.log('XXXXXXXXXXXXXXXXXX ERROR loading video');
                    __playNext();
                    logger.logError(e);
                });
            });
            
            // INIT FIRST MEDIUM
            __prepareNext(true);  // First run initialization
            
            // FIRST RUN
            __playNext(true);  // First run
            
            console.log('+++++++++ Player.init()');
        }
        catch (e) {
            logger.logError(e);
            
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
    function __prepareNext(throw_error = false) {
        try {
            ++self.playlist_index;
            if ( self.playlist_index >= self.playlist.playlist.id.length ) {
                self.playlist_index = 0;
            }
            
            self.next_medium = __getMediumByIndex(self.playlist_index);
            
            let next_element = null;
            
            if ( self.next_medium.type === 'video' ) {
                next_element = self.html_wrapper.querySelector('video.inactive');  // Has to be fresh instance
                next_element.src = self.next_medium.src;
                next_element.pause();
                next_element.currentTime = 0;
                next_element.classList.add('next');
            }
            else if ( self.next_medium.type === 'image' ) {
                next_element = self.html_wrapper.querySelector('img.inactive');
                next_element.src = self.next_medium.src;
                next_element.classList.add('next');
            }
            else if ( self.next_medium.type === 'www' ) {
                next_element = self.html_wrapper.querySelector('iframe.inactive');
                next_element.src = self.next_medium.src;
                next_element.classList.add('next');
            }
            
            if ( !next_element ) {
                throw new Error('Next html element not found according .inactive css class');
            }
        }
        catch (e) {
            // If there is any problem with next medium call __prepareNext() to set next medium in the playlist instead of current next
            logger.logError(e);
            __prepareNext();
            if ( throw_error ) throw e;
        }
    }
    
    /**
     * THIS METHOD PLAYS NEXT ELEMENT IN THE PLAYLIST
     * HIDE PREVIOUS ELEMENT AND SHOW NEXT ELEMENT VIA CSS
     */
    function __playNext(throw_error = false) {
        try {
            self.current_medium = self.next_medium;
            let next_element = self.html_wrapper.querySelector('.next');  // This should be 100% available cause __prepareNext() throws error if next_element is missing
            let active_element = self.html_wrapper.querySelector('.active');  // This can be undefined
            
            // VIDEO NEEDS TO CALL PLAY()
            if ( self.current_medium.type === 'video' ) {
                next_element.play();
            }
            
            // HIDE PREV ACTIVE ELEMENT
            if ( active_element ) {
                active_element.classList.add('inactive');  // Hide current element
                active_element.classList.remove('active');  // Remove active class from current element
            }
            
            // SHOW NEXT ELEMENT
            next_element.classList.remove('next', 'inactive');  // Show next element
            next_element.classList.add('active');  // Set next element as active
            
            // VIDEO HAVE EVENT LISTENERS FOR END DEFINED IN INIT METHOD
            // BUT IMAGE AND IFRAME NEED TO HAVE FRESH TIMEOUT WHICH ENDS THE PLAY
            if ( self.current_medium.type === 'image' || self.current_medium.type === 'www' ) {
                
                self.timeout = setTimeout(function () {
                    console.log('.................. IMAGE OR IFRAME ENDED ' + self.current_medium.campaign_id);
                    logger.logImpression(self.current_medium);
                    __playNext();
                }, self.next_medium.duration * 1000 - 20);  // -20 is little reserve
            }
            
            __prepareNext();
        }
        catch (e) {
            logger.logError(e);
            clearTimeout(self.timeout);  // HAS TO STOP TIMEOUT FOR IMAGES OR IFRAMES
            __prepareNext();
            __playNext();
            if ( throw_error ) throw e;
        }
    }
    
    /**
     * LOAD PLAYLIST FROM LOCAL SERVER
     */
    async function __loadPlaylist() {
        
        const response = await axios.get('http://localhost/player/php/playlist.php?screen_id=' + self.screen_config.id);
        
        __validatePlaylist(response.data);
        
        self.playlist = response.data;
        
        let now = __getCurrentTime();
        
        // FIND INDEX OF THE FIRST ELEMENT TO PLAY ACCORDING TO CURRENT TIME.
        let now_idx = self.playlist.playlist.time.findIndex((time, idx) => time > now);
        
        self.playlist_index = now_idx > 0 ? now_idx : 0;
    }
    
    /**
     * GET MEDIUM BY INDEX
     * @param idx
     * @returns {{duration: *, src: *, screen_id, type}}
     * @private
     */
    function __getMediumByIndex(idx) {
        try {
            let playlist_item_id = self.playlist.playlist.id[idx][0];  // Find item id according current index in playlist.playlist.id array
            let playlist_item = self.playlist.items.find((item) => item.id === playlist_item_id);  // Find item id in playlist.items array
            
            let medium = {
                campaign_id: playlist_item.id_campaign,
                media_id: playlist_item.id_media,
                type: playlist_item.type,
                src: playlist_item.src,
                duration: playlist_item.duration,
                screen_id: self.screen_config.id,
            }
            
            return medium;
        }
        catch (e) {
            throw new Error('Medium item id not found in playlist items array');
        }
    }
    
    /**
     * GET CURRENT TIME in HH:MM:SS format
     * @returns {string}
     * @private
     */
    function __getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}`;
    }
    
    /**
     * VALIDATE PLAYLIST
     * @param playlist
     * @private
     */
    function __validatePlaylist(playlist) {
        
        if ( !playlist ) {
            throw new Error('Playlist validation error - Playlist is empty');
        }
        else if ( typeof playlist.items === 'undefined' || playlist.items.length === 0 ) {
            throw new Error('Playlist validation error - Playlist items array is missing');
        }
        else if ( typeof playlist.playlist.id === 'undefined' || playlist.playlist.id.length === 0 ) {
            throw new Error('Playlist validation error - Playlist id array is missing');
        }
        else if ( typeof playlist.playlist.time === 'undefined' || playlist.playlist.time.length === 0 ) {
            throw new Error('Playlist validation error - Playlist time array is missing');
        }
        
        playlist.items.forEach((item) => {
            if ( typeof item.id === 'undefined' ) {  // item.id is required
                throw new Error('Playlist validation error - Playlist item.id is missing');
            }
            // TODO: Player can run also with this error. This blocks the player.
            /*else if ( !playlist.playlist.id.find((i) => i[0] == item.id ) ) {  // item.id has to be included in playlist.playlist.id array
                throw new Error('Playlist validation error - Playlist item.id is is not included in playlist.playlist.id array');
            }*/
            else if ( typeof item.id_campaign === 'undefined' ) {  // item.campaign_id is required
                throw new Error('Playlist validation error - Playlist item.id_campaign is missing');
            }
            else if ( typeof item.id_media === 'undefined' ) {  // item.id_media is required
                throw new Error('Playlist validation error - Playlist item.id_media is missing');
            }
            else if ( typeof item.type === 'undefined' ) {  // item.type is required
                throw new Error('Playlist validation error - Playlist item type is missing');
            }
            else if ( ['video', 'image', 'www'].indexOf(item.type) === -1 ) {  // item.type has to be one of the allowed types
                throw new Error('Playlist validation error - Playlist item type is out of allowed range');
            }
            else if ( typeof item.src === 'undefined' ) {  // item.src is required
                throw new Error('Playlist validation error - Playlist item src is missing');
            }
            else if ( typeof item.duration === 'undefined' ) {  // item.duration is required
                throw new Error('Playlist validation error - Item duration is missing');
            }
            else if ( !item.duration ) {  // item.duration has to be greater than 0
                throw new Error('Playlist validation error - Playlist item.duration is empty');
            }
        });
    }
}