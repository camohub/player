/**
 * LOGGER MODULE
 */
function Config() {
    
    const self = this;
    
    self.config = null;
    
    self.players = [];
    
    /////// METHODS ////////////////////////////////////////////////////
    
    /**
     * LOAD CONFIG
     */
    self.init = async function() {
        try {
            let response = await axios.get('http://localhost/player/php/config.php');
            
            self.config = response.data;
            
            console.log('Config.init() +++++++++');
        }
        catch (e) {
            logger.logError(e);
        }
    }
}