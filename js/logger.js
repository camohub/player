/**
 * LOGGER CONSTRUCTOR. USE IT AS new Logger()
 */
function Logger() {
    
    const self = this;
    
    self.impressions = [];
    
    self.errors = [];
    
    self.connection_error = false;
    
    /////// METHODS ////////////////////////////////////////////////////
    
    /**
     * INIT THE LOGGER
     */
    self.init = async function() {
        await __sendOk();
        
        setInterval(function() {
            __sendOk();
            __sendErrors();
            __sendImpressions();
        }, 10000);
        
        console.log('Logger.init() +++++++++');
    }
    
    /**
     * ADD IMPRESION TO ARRAY
     * @param medium
     */
    self.logImpression = async function(medium) {
        medium.timestamp = Math.round(Date.now() / 1000);  // now() returns milliseconds but we need seconds and integer
        self.impressions.push(medium);
    }
    
    /**
     * ADD ERROR TO ARRAY
     * @param e
     */
    self.logError = async function(e) {
        
        if ( self.errors.length > 500 ) return;  // Prevent memory leak
        
        if ( !(e instanceof Error) ) e = new Error(e);  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
        
        self.errors.push({
            "message": e.toString(),
            'stack': (e.stack ? e.stack : null),
            'timestamp': Math.round(Date.now() / 1000),  // now() returns milliseconds but we need seconds and integer
        });
    }
    
    ////// PRIVATE ///////////////////////////////////////////////////////////////////////
    
    /**
     * SEND ERRORS TO LOCAL SERVER
     * @private
     */
    async function __sendErrors() {
        
        if ( __hasConnectionError() ) return;
        
        
        let errors_to_send = [];  // It has to be outside the try..catch scope otherwise it will be undefined in the catch block
        
        try {
            errors_to_send = self.errors.splice(0, 50);  // Send 50 errors at once
            
            if ( errors_to_send.length > 0 ) {
                await axios.post('http://localhost/player/php/error.php', { errors: errors_to_send });
                console.log('Errors sent:', errors_to_send);
            }
        }
        catch (e) {
            // Put errors back to self.errors array
            if ( errors_to_send.length > 0 ) {
                self.errors = [...errors_to_send, ...self.errors];
                console.log('Errors back to queue:', self.errors);
            }
            
            self.logError(e);  // Log connection error
        }
    }
    
    /**
     * SEND IMPRESSIONS TO LOCAL SERVER
     * @private
     */
    async function __sendImpressions() {
        
        if ( __hasConnectionError() ) return;
        
        
        let impressions_to_send = [];  // It has to be outside the try..catch scope otherwise it will be undefined in the catch block
        
        try {
            impressions_to_send = self.impressions.splice(0, 50);  // Send 50 impressions at once
            
            if ( impressions_to_send.length > 0 ) {
                await axios.post('http://localhost/player/php/impressions.php', { impressions: impressions_to_send });
                console.log('Impressions sent:', impressions_to_send);
            }
        }
        catch (e) {
            // Put impressions back to self.impressions array
            if ( impressions_to_send.length > 0 ) {
                self.impressions = [...impressions_to_send, ...self.impressions];
                console.log('Impressions back to queue:', self.impressions);
            }
            
            self.logError(e);  // Log connection error
        }
    }
    
    /**
     * LOG IF SCRIP IS STILL RUNNING WITHOUT BLOCKING JAVASCRIPT ERRORS
     * There can be errors caught in try..catch but not blocking the javascript
     * PRIVATE
     */
    async function __sendOk() {
        
        try {
            await axios.get('http://localhost/player/php/connection.php');
            
            self.connection_error = null;
        }
        catch (e) {
            if ( __canAddConnectionError() ) {
                self.connection_error = Math.round(Date.now() / 1000);  // In seconds
                self.logError(e);
            }
        }
    }
    
    /**
     * ADD CONNECTION ERROR ONLY ONCE IN A MINUTE
     * @returns {boolean}
     * @private
     */
    function __canAddConnectionError() {
        
        let now = Math.round(Date.now() / 1000);  // In seconds
        
        if ( self.connection_error && now - self.connection_error < 60 ) {
            return false;
        }
        
        return true;
    }
    
    /**
     * CHECK IF THERE IS CONNECTION ERROR
     * @returns {boolean}
     * @private
     */
    function __hasConnectionError(){
        return self.connection_error;
    }
}