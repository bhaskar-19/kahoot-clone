$(document).ready(async ()=>{
    const params = new URLSearchParams(window.location.search);
    try
    {
        const quizId = params.get('id');
        const jwttoken = localStorage.getItem('data');
        const gameData = await $.ajax({
            method: 'GET',
            url: 'http://18.222.118.35:80/game/games/'+quizId,
            headers: {
                "jwttoken": jwttoken
            }
        });
        console.log(gameData);
        if(gameData.success)
        {
            
            let templateString = ``;
            let id = 1;
            for(let game of gameData.games.games)
            {
                console.log(game);
                templateString+=`<tr>
                        <th style="vertical-align:baseline;" scope="col">${id++}</th>
                        <th style="vertical-align:baseline;" scope="col">${game.batch}</th>
                        <th style="vertical-align:baseline;" scope="col" class = "quiz-foot"><button onclick="leaderBoard('${quizId}','${game._id}')" type = "button" Style="background-color: #8EE4AF;">></button>
                        </th>
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

function leaderBoard(quizId,gameId)
{
    window.location.href='../batchLeaderBoard.html?quizId='+quizId+'&gameId='+gameId;
}

function home()
{
    window.location.href = '/admin/createQuiz.html';
}