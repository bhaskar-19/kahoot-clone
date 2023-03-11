const socket = io();

const params = new URLSearchParams(window.location.search);

let timer;
let timerId;
let qn = 1;
let time = 20;

socket.on('connect', ()=>{
    const hostId = {
        id : params.get('id')
    }
    socket.emit('host-join-game', hostId);
});

socket.on('noGameFound', function(){
    window.location.href = './admin/createQuiz.html';
 });

socket.on('gameQuestions', (questions)=>{
    $('#question').html(questions.q1);
    $('#option1').html(questions.op1);
    $('#option2').html(questions.op2);
    $('#option3').html(questions.op3);
    $('#option4').html(questions.op4);

    const correctOption = questions.correctOption;
    $('#playersAnswered').html("Players Answered 0 / " + questions.playersInGame);
    $('#questionNum').html("Question "+(qn++)+" / "+ questions.questions)
    updateTimer();
});

function updateTimer(){
    time = 20;
    timerId = setInterval(()=>{
        time -= 1;
        $('#num').html(" " + time);
        if(time == 0){
            socket.emit('timeUp');
        }
    }, 1000);
}

socket.on('updatePlayersAnswered', (data)=>{
    $('#playersAnswered').html("Players Answered " + data.playersAnswered + " / " + data.playersInGame); 
 });

socket.on('questionOver', (playerData, correctOption)=>{
    clearInterval(timerId);
    let option1 = 0;
    let option2 = 0;
    let option3 = 0;
    let option4 = 0;
    let total = 0;
    $('#playersAnswered').css('display', "none");
    $('#timerText').css('display', "none");
    console.log(correctOption);
    if(correctOption == 1)
    {
        const option = $('#option1').html();
        $('#option1').html("&#10004"+" "+option);
        $('#option2').css('filter', 'opacity(0.5)');
        $('#option3').css('filter', 'opacity(0.5)');
        $('#option4').css('filter', 'opacity(0.5)');
    }
    else if(correctOption == 2)
    {
        const option = $('#option2').html();
        $('#option2').html("&#10004"+" "+option);
        $('#option1').css('filter', 'opacity(0.5)');
        $('#option3').css('filter', 'opacity(0.5)');
        $('#option4').css('filter', 'opacity(0.5)');
    }
    else if(correctOption == 3)
    {
        const option = $('#option3').html();
        $('#option3').html("&#10004"+" "+option);
        $('#option2').css('filter', 'opacity(0.5)');
        $('#option1').css('filter', 'opacity(0.5)');
        $('#option4').css('filter', 'opacity(0.5)');
    }
    else if(correctOption == 4)
    {
        const option = $('#option4').html();
        $('#option4').html("&#10004"+" "+option);
        $('#option2').css('filter', 'opacity(0.5)');
        $('#option3').css('filter', 'opacity(0.5)');
        $('#option1').css('filter', 'opacity(0.5)');
    }

    // Graph players choosed option
    for(let i=0; i<playerData.length; i++)
    {
        if(playerData[i].gameData.answer == 1)
        {
            option1 += 1;
        }else if(playerData[i].gameData.answer == 2)
        {
            option2 += 1;
        }else if(playerData[i].gameData.answer == 3)
        {
            option3 += 1;
        }else if(playerData[i].gameData.answer == 4)
        {
            option4 += 1;
        }
        total += 1;
    }

    option1 = option1 / total * 100;
    option2 = option2 / total * 100;
    option3 = option3 / total * 100;
    option4 = option4 / total * 100;
    
   

    $('#square1').css('display', "inline-block");
    $('#square2').css('display', "inline-block");
    $('#square3').css('display', "inline-block");
    $('#square4').css('display', "inline-block");

    $('#square1').css('height', option1+"px");
    $('#square2').css('height', option2+"px");
    $('#square3').css('height', option3+"px");
    $('#square4').css('height', option4+"px");

    $('#nextQButton').css('display', "block");
});

function nextQuestion()
{
    $('#nextQButton').css('display', "none");

    $('#square1').css('display', "none");
    $('#square2').css('display', "none");
    $('#square3').css('display', "none");
    $('#square4').css('display', "none");

    $('#option1').css('filter', "none");
    $('#option2').css('filter', "none");
    $('#option3').css('filter', "none");
    $('#option4').css('filter', "none");

    $('#playersAnswered').css('display', 'block');
    $('#timerText').css('display', 'block');    
    $('#num').html(20);

    socket.emit('nextQuestion');
}

socket.on('GameOver', (results)=>{
    $('#nextQButton').css('display', "none");

    $('#square1').css('display', "none");
    $('#square2').css('display', "none");
    $('#square3').css('display', "none");
    $('#square4').css('display', "none");

    $('#option1').css('display', "none");
    $('#option2').css('display', "none");
    $('#option3').css('display', "none");
    $('#option4').css('display', "none");

    $('#playersAnswered').html('');
    $('#questionNum').html('');
    $('#timerText').html('');
    $('#question').html("Game Over");

    $('#winner1').css('display', 'block');
    $('#winner2').css('display', 'block');
    $('#winner3').css('display', 'block');
    $('#winner4').css('display', 'block');
    $('#winner5').css('display', 'block');
    $('#winnerTitle').css('display', 'block');

    $('#winner1').html('1. '+results.num1);
    $('#winner2').html('2. '+results.num2);
    $('#winner3').html('3. '+results.num3);
    $('#winner4').html('4. '+results.num4);
    $('#winner5').html('5. '+results.num5);

    $('#home').css('display', 'block');
});

socket.on('getTime', function(player){
    socket.emit('time', {
        player: player,
        time: time
    });
});

function home()
{
    window.location.href = './admin/createQuiz.html'
}