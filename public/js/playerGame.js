const socket = io();
let playerAnswered = false;
let correct = false;
let name;
let score = 0;

const hostId = new URLSearchParams(window.location.search);

socket.on('connect', ()=>{
    const id = hostId.get('id');
    
    socket.emit('player-join-game', id);

    $('#option1').css("visibility", "visible");
    $('#option2').css("visibility", "visible");
    $('#option3').css("visibility", "visible");
    $('#option4').css("visibility", "visible");
});

socket.on('noGameFound', function(){
    window.location.href = '../abc.html';//Redirect user to 'join game' page 
});

function answerSubmitted(option)
{
    if(playerAnswered == false)
    {
        playerAnswered = true;

        socket.emit('playerAnswer', option);

        $('#option1').css("visibility", "hidden");
        $('#option2').css("visibility", "hidden");
        $('#option3').css("visibility", "hidden");
        $('#option4').css("visibility", "hidden");
        $('#message').css("display", "block");
        $('#message').html("Answer Submitted..!  Waiting on other players...");
    }
}

socket.on('answerResult', (isCorrect)=>{
    if(isCorrect == true)
    {
        correct = true;
    }
})

socket.on('questionOver', ()=>{
    if(correct == true)
    {
        $('body').css("backgroundColor", "green");
        $('#message').css("display", "block");
        $('#message').html("Correct!");
    }
    else
    {
        $('body').css("backgroundColor", "red");
        $('#message').css("display", "block");
        $('#message').html("Incorrect!");
    }
    $('#option1').css("visibility", "hidden");
    $('#option2').css("visibility", "hidden");
    $('#option3').css("visibility", "hidden");
    $('#option4').css("visibility", "hidden");
    socket.emit('getScore');
});

socket.on('newScore', (playerScore)=>{
    $('#scoreText').html("Score: "+playerScore);
});

socket.on('nextQuestionPlayer', ()=>{
    correct = false;
    playerAnswered = false;

    $('#option1').css("visibility", "visible");
    $('#option2').css("visibility", "visible");
    $('#option3').css("visibility", "visible");
    $('#option4').css("visibility", "visible");
    $('#message').css("display", "none");
    $('body').css('backgroundColor', 'white');
});

socket.on('playerGameData', (playerData)=>{

    for(let i = 0; i < playerData.length; i++){
        if(playerData[i].playerId == socket.id){
            $('#nameText').html("Name: "+playerData[i].name);
            $('#scoreText').html("Score: "+playerData[i].gameData.score);        }
    }
 });

socket.on('GameOver', ()=>{
    $('body').css('backgroundColor', '#FFFFFF');
    $('#message').css("display", "block");
    $('#message').html("Game Over..!");
    $('#option1').css("visibility", "hidden");
    $('#option2').css("visibility", "hidden");
    $('#option3').css("visibility", "hidden");
    $('#option4').css("visibility", "hidden");
});

socket.on('hostDisconnected', function(){
    window.location.href = "../";
});
