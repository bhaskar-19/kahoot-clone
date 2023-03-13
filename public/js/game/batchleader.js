$(document).ready(async ()=>{
    const params = new URLSearchParams(window.location.search);
    try
    {
        const quizId = params.get('quizId');
        const gameId = params.get('gameId');
        const jwttoken = localStorage.getItem('data');
        const gameData = await $.ajax({
            method: 'GET',
            url: 'http://18.222.118.35:80/game/players/'+quizId+'/'+gameId,
            headers: {
                "jwttoken": jwttoken
            }
        });
       
        if(gameData.success)
        {
            
            let templateString = ``;
            let id = 1;
            for(let game of gameData.gameData)
            {
                templateString+=`<tr>
                        <th style="vertical-align:baseline;" scope="col">${id++}</th>
                        <th style="vertical-align:baseline;" scope="col">${game.games.players.name}</th>
                        <th style="vertical-align:baseline;" scope="col" class = "quiz-foot">${game.games.players.score}</th>
                    </tr>
                `;
            }
            $('#tbody').append(templateString);
        }
    }
    catch(error)
    {
        console.log(error);
    }
});

function leaderBoard(gameId)
{
    window.location.href='../batchLeaderBoard.html?id='+gameId;
}

function home()
{
    window.location.href = './admin/createQuiz.html';
}