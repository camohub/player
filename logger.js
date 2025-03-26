/**
 * LOGGER MODULE
 * @type {{logImpressions: logger.logImpressions, logError: logger.logError, logOk: logger.logOk, clearErrors: logger.clearErrors, impressions: *[], clearImpressions: logger.clearImpressions, errors: *[]}}
 */
logger = {
    
    impressions: [],
    
    errors: [],
    
    /////// METHODS ////////////////////////////////////////////////////
    
    logImpressions: function(medium) {
        
        medium.timestamp = new Date().getUTCSeconds();
        logger.impressions.push(medium);
        
        if ( logger.impressions.length >= 3 ) {
            
            try {
                axios.post('http://localhost/player/impressions.php', { impressions: logger.impressions, });
            
                logger.clearImpressions();
            }
            catch (e) {
                logger.logError(e);
            }
        }
    },
    
    /**
     * LOG ERROR TO LOCAL SERVER
     * @param e
     * @param i  // Increment to prevent infinite loop
     */
    logError: function(e, i = 0) {
        
        if ( logger.errors.length > 100 ) return;  // Prevent memory overflow
        
        if (!(e instanceof Error)) e = new Error(e);  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
        
        logger.errors.push({
            "message": e.toString(),
            'stack': (e.stack ? e.stack : null),
        });
        
        try {
            console.log(logger.errors);
            axios.post('http://localhost/player/error.php', { errors: logger.errors });
            
            logger.clearErrors();
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
        
        if ( logger.errors.length ) return;
        
        try {
            const response = axios.get('http://localhost/player/ok.php');
        }
        catch (e) {
            logger.logError(e);
        }
    },
    
    clearErrors: function() {
        logger.errors = [];
    },
    
    clearImpressions: function() {
        logger.impressions = [];
    }
}

setInterval(function() {
    logger.logOk();
}, 10000);