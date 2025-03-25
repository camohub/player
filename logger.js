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
                const response = axios.post('http://localhost/player/impressions.php', { impressions: logger.impressions, });
            
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
     * @param i
     */
    logError: function(e, i = 0) {
        
        console.error(e);
        logger.errors.push(e);
        
        try {
            const response = axios.post('http://localhost/player/error.php', { error: logger.errors, });
            
            logger.clearErrors();
        }
        catch (e) {
            // This set up delay and max increment to prevent infinite loop
            setTimeout(function () {
                if (i < 30) {
                    logger.logError(e, ++i);  // e is not the same as catch_error
                }
            }, 2000);
        }
    },
    
    /**
     * LOG IF SCRIP IS STILL RUNNING WITHOUT ERRORS TO LOCAL SERVER
     */
    logOk: function() {
        
        console.log('LOG OK');
        console.log(this);
        
        if ( !logger.errors.length ) return;
        
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