class Players {
    constructor () {
        this.players = [];
    }
    addPlayer(hostId, playerId, name,id, gameData){
        var player = {hostId, playerId, name, id, gameData};
        this.players.push(player);
        return player;
    }
    removePlayer(playerId){
        var player = this.getPlayer(playerId);
        
        if(player){
            this.players = this.players.filter((player) => player.playerId !== playerId);
        }
        return player;
    }
    getPlayer(playerId){
        return this.players.filter((player) => player.playerId === playerId)[0]
    }
    getPlayers(hostId){
        return this.players.filter((player) => player.hostId === hostId);
    }
    removeAllPlayers()
    {
        this.players = [];
    }
    getAllPlayers()
    {
        return this.players;
    }
}

module.exports = {Players};