var socket = io();
var id = "6405dd652a88b7d458b94557";

socket.on('connect', ()=>{
    $('#players').val = "";
    socket.emit('host-join', id);
});

socket.on('showGamePin', (data)=>{
    $('#gamePinText').html(data.pin);
});

socket.on('noGameFound', ()=>{
    window.location.href = '../';
});

socket.on('updatePlayerLobby', (players)=>{
    $('#players').html("");
    let playerNames = "";
    for(let i=0; i<players.length; i++)
    {
        playerNames+=players[i].name+'\n';
        
    }
    $('#players').html(playerNames);
});

function startGame(){
    socket.emit('startGame');
}

function endGame(){
    window.location.href = "/";
}

socket.on('gameStarted', (hostId)=>{
    console.log("Game Started");
    window.location.href="/hostGame.html"+"?id="+hostId;
})