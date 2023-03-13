var socket = io();
var params = new URLSearchParams(window.location.search);

socket.on('connect', ()=>{
    $('#players').val = "";
    const data = {
        id: params.get('id'),
        batch : params.get('batch')
    };
   
    socket.emit('host-join', data);
});

socket.on('showGamePin', (data)=>{
    $('#gamePinText').html(data.pin);
});

socket.on('noGameFound', ()=>{
    window.location.href = './admin/createQuiz.html';
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
    window.location.href = "./admin/createQuiz.html";
}

socket.on('gameStarted', (hostId)=>{
    console.log("Game Started");
    window.location.href="/hostGame.html"+"?id="+hostId;
})