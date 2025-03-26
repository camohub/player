/**
 * LOGGER MODULE
 */
logger = {
    
    impressions: [],
    
    errors: [],
    
    /////// METHODS ////////////////////////////////////////////////////
    
    logImpressions: function(medium) {
        
        medium.timestamp = Math.round(Date.now() / 1000);  // now() returns milliseconds but we need seconds and integer
        logger.impressions.push(medium);
            
        try {
            axios.post('http://localhost/player/impressions.php', { impressions: logger.impressions, });
        
            logger.__clearImpressionsxxx();
        }
        catch (e) {
            logger.logError(e);
        }
    },
    
    /**
     * LOG ERROR TO LOCAL SERVER
     * @param e
     * @param i  // Increment to prevent infinite loop
     */
    logError: function(e, i = 0) {
        
        if ( logger.errors.length > 200 ) return;  // Prevent memory leak
        
        if ( !(e instanceof Error) ) e = new Error(e);  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
        
        logger.errors.push({
            "message": e.toString(),
            'stack': (e.stack ? e.stack : null),
        });
        
        try {
            axios.post('http://localhost/player/error.php', { errors: logger.errors });
            
            logger.__clearErrors();
        }
        catch (catch_error) {
            // This set up delay to prevent too many server requests
            // and max increment to prevent infinite loop
            setTimeout(function () {
                if ( i < 10 ) logger.logError(e, ++i);  // e is original error not the catch_error.
            }, 10000);
        }
    },
    
    /**
     * LOG IF SCRIP IS STILL RUNNING WITHOUT BLOCKING JAVASCRIPT ERRORS
     * There can be errors caught in try..catch but not blocking the javascript
     */
    logOk: function() {
        
        try {
            axios.get('http://localhost/player/ok.php');
        }
        catch (e) {
            logger.logError(e);
        }
    },
    
    
    __clearErrors: function() {
        logger.errors = [];
    },
    
    __clearImpressions: function() {
        logger.impressions = [];
    }
}

setInterval(function() {
    logger.logOk();
}, 10000);