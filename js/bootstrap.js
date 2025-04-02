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
    self.init = async function(i = 0) {
        try {
            logger = new Logger();
            config = new Config();
            
            await logger.init();
            await config.init();
            await self.setUpPlayers();
            console.log('Bootstrap.init() +++++++++');
        }
        catch (e) {  // THERE CAN BE CONNECTION ERROR SO NEED TO WAIT AND TRY AGAIN
            console.error(e);
            if ( ++i > 50 ) {
                logger.logError(e);
                i = 0;
            }
            
            setTimeout(function (i) {
                self.init();
            }, 15000);
        }
    }
    
    /**
     * SET UP PLAYERS ACCORDING SCREENS CONFIG
     */
    self.setUpPlayers = function() {
        
        config.config.content.player.items.forEach(function (screen, idx) {
            let player = new Player(screen);
            player.initHtml();
            player.init();
            self.players.push(player);
        });
    }
    
}

bootstrap = (new Bootstrap()).init();