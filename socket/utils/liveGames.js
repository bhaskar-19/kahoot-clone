class LiveGames {
    constructor () {
        this.games = [];
    }
    addGame(pin, hostId,batch, gameLive, gameData){
        const game = {pin, hostId,batch, gameLive, gameData};
        this.games.push(game);
        return game;
    }
    removeGame(hostId){
        const game = this.getGame(hostId);
        
        if(game){
            this.games = this.games.filter((game) => game.hostId !== hostId);
        }
        return game;
    }
    getGame(hostId){
        return this.games.filter((game) => game.hostId === hostId)[0]
    }
    getGames()
    {
        return this.games;
    }
}

module.exports = {LiveGames};