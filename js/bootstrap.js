/**
 * LOGGER CONSTRUCTOR. USE IT AS new Bootstrap()
 */
function Bootstrap() {
    
    const self = this;
    
    self.players = [];
    
    /////// METHODS ////////////////////////////////////////////////////
    
    /**
     *
     * @param i
     * @returns {Promise<void>}
     */
    self.init = async function() {
        try {
            // INIT LOGGER
            logger = new Logger();
            await logger.init();
            
            // INIT CONFIG
            config = new Config();
            await config.init();
            
            // INIT PLAYERS
            config.config.content.player.items.forEach(function (screen, idx) {
                let player = new Player(screen);
                player.initHtml();
                player.init();
                self.players.push(player);
            });
        }
        catch (e) {  // THERE CAN BE CONNECTION ERROR SO NEED TO WAIT AND TRY AGAIN
            logger.logError(e);
            
            setTimeout(function (i) {
                self.init();
            }, 15000);
        }
    }
    
    ///////// PRIVATE METHODS /////////////////////////////////////////////
    
    
}

bootstrap = new Bootstrap();
bootstrap.init();