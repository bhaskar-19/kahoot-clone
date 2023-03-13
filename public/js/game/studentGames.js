$(document).ready(async()=>{
    $('.username').html(localStorage.getItem('name'));
    try
    {
        const games = await $.ajax({
            method: 'GET',
            url: 'http://18.222.118.35:80/game/playerGames/'+localStorage.getItem('id'),
            headers: {
                "jwttoken": localStorage.getItem('data')
            }
        });
        
        if(games.success)
        {
            let templateString = ``;
            for(let game of games.games)
            {
                templateString+=`<tr>
                        <th style="vertical-align:baseline;" scope="col">${game.quiz}</th>
                        <th style="vertical-align:baseline;" scope="col">${game.batch}</th>
                        <th style="vertical-align:baseline;" scope="col">${game.score}</th>
                        <th style="vertical-align:baseline;" scope="col" class = "quiz-foot"><button onclick="leaderBoard('${game.batchId}')" type = "button" Style="background-color: #8EE4AF;">></button>
                        </th>
                    </tr>
                `;
            }
            $('#tbody').append(templateString);
        }
    }
    catch(error)
    {
        if(error.status == 404)
        {
            alert("No games found");
        }
        else
        {
            console.log(error);
        }
    }
    

});

function leaderBoard(batchId)
{
    window.location.href = '../studentLeaderBoard.html?id='+batchId;
}


function signOut()
{
    localStorage.clear();
    $.removeCookie('userData', { path: '/' });
    window.location.href = '/';
}