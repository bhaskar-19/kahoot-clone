const socket = io();

socket.on('connect', ()=>{
    const params = new URLSearchParams(window.location.search);
    //console.log(params.get('pin'));
    const formData = {
        pin: params.get('pin'),
        name: params.get('name')
    }
    socket.emit('player-join', formData);
});

socket.on('noGameFound', function(){
    window.location.href = '../';
});

socket.on('hostDisconnect', function(){
    window.location.href = '../';
});

socket.on('gameStartedPlayer', function(){
    window.location.href="/playerGame.html" + "?id=" + socket.id;
});