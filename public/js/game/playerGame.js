const socket = io();
let playerAnswered = false;
let correct = false;
let name;
let score = 0;

const playerId = new URLSearchParams(window.location.search);

socket.on('connect', ()=>{
    const id = playerId.get('id');
    socket.emit('player-join-game', id);
});
socket.on('gameQuestions', (questions)=>{
    console.log("HEREEE TRUEE");
    console.log(questions);
    $('#question').html(questions.q1);
    $('#opt1').html(questions.op1);
    $('#opt2').html(questions.op2);
    $('#opt3').html(questions.op3);
    $('#opt4').html(questions.op4);
});

socket.on('noGameFound', function(){
    window.location.href = '/admin/studentDashboard.html';//Redirect user to 'join game' page 
});

function answerSubmitted(option)
{
    if(playerAnswered == false)
    {
        playerAnswered = true;

        socket.emit('playerAnswer', option);
        $('#question').css("visibility", "hidden");
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
    $('#question').css("visibility", "hidden");
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
    $('#question').css("visibility", "visible");
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
    $('#question').css("display", "none");
    $('#option1').css("display", "none");
    $('#option2').css("display", "none");
    $('#option3').css("display", "none");
    $('#option4').css("display", "none");

    $('#home').css('display', 'block');
});

socket.on('hostDisconnected', function(){
    window.location.href = "/admin/studentDashboard.html";
});

function home()
{
    window.location.href = "/admin/studentDashboard.html";
}