/**
 * LOGGER MODULE
 */
logger = {
    
    impressions: [],
    
    errors: [],
    
    connection_error: false,
    
    /////// METHODS ////////////////////////////////////////////////////
    
    /**
     * INIT THE LOGGER
     */
    init: function() {
        
        setInterval(function() {
            logger.__sendOk();
            logger.__sendErrors();
            logger.__sendImpressions();
        }, 10000);
    },
    
    /**
     * ADD IMPRESION TO ARRAY
     * @param medium
     */
    logImpression: async function(medium) {
        medium.timestamp = Math.round(Date.now() / 1000);  // now() returns milliseconds but we need seconds and integer
        logger.impressions.push(medium);
    },
    
    /**
     * ADD ERROR TO ARRAY
     * @param e
     */
    logError: async function(e) {
        
        if ( logger.errors.length > 500 ) return;  // Prevent memory leak
        
        if ( !(e instanceof Error) ) e = new Error(e);  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
        
        logger.errors.push({
            "message": e.toString(),
            'stack': (e.stack ? e.stack : null),
            'timestamp': Math.round(Date.now() / 1000),  // now() returns milliseconds but we need seconds and integer
        });
    },
    
    ////// PRIVATE ///////////////////////////////////////////////////////////////////////
    
    /**
     * SEND ERRORS TO LOCAL SERVER
     */
    __sendErrors: async function() {
        
        if ( logger.__hasConnectionError() ) return;
        
        
        let errors_to_send = [];  // It has to be outside the try..catch scope otherwise it will be undefined in the catch block
        
        try {
            errors_to_send = logger.errors.splice(0, 50);  // Send 50 errors at once
            
            if ( errors_to_send.length > 0 ) {
                await axios.post('http://localhost/player/error.php', { errors: errors_to_send });
                console.log('Errors sent:', errors_to_send);
            }
        }
        catch (e) {
            // Put errors back to logger.errors array
            if ( errors_to_send.length > 0 ) {
                logger.errors = [...errors_to_send, ...logger.errors];
                console.log('Errors back to queue:', logger.errors);
            }
            
            logger.logError(e);  // Log connection error
        }
    },
    
    /**
     * SEND IMPRESSIONS TO LOCAL SERVER
     */
    __sendImpressions: async function() {
        
        if ( logger.__hasConnectionError() ) return;
        
        
        let impressions_to_send = [];  // It has to be outside the try..catch scope otherwise it will be undefined in the catch block
        
        try {
            impressions_to_send = logger.impressions.splice(0, 50);  // Send 50 impressions at once
            
            if ( impressions_to_send.length > 0 ) {
                await axios.post('http://localhost/player/impressions.php', { impressions: impressions_to_send });
                console.log('Impressions sent:', impressions_to_send);
            }
        }
        catch (e) {
            // Put impressions back to logger.impressions array
            if ( impressions_to_send.length > 0 ) {
                logger.impressions = [...impressions_to_send, ...logger.impressions];
                console.log('Impressions back to queue:', logger.impressions);
            }
            
            logger.logError(e);  // Log connection error
        }
    },
    
    /**
     * LOG IF SCRIP IS STILL RUNNING WITHOUT BLOCKING JAVASCRIPT ERRORS
     * There can be errors caught in try..catch but not blocking the javascript
     */
    __sendOk: async function() {
        
        try {
            await axios.get('http://localhost/player/connection.php');
            
            logger.connection_error = null;
        }
        catch (e) {
            if ( logger.__canAddConnectionError() ) {
                logger.connection_error = Math.round(Date.now() / 1000);  // In seconds
                logger.logError(e);
            }
        }
    },
    
    /**
     * ADD CONNECTION ERROR ONLY ONCE IN A MINUTE
     * @returns {boolean}
     * @private
     */
    __canAddConnectionError: function() {
        
        let now = Math.round(Date.now() / 1000);  // In seconds
        
        if ( logger.connection_error && now - logger.connection_error < 60 ) {
            return false;
        }
        
        return true;
    },
    
    /**
     * CHECK IF THERE IS CONNECTION ERROR
     * @returns {boolean}
     * @private
     */
    __hasConnectionError: function() {
        return logger.connection_error;
    }
}

logger.init();