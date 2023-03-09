$(document).ready(async()=>{
    try
    {
        const games = await $.ajax({
            method: 'GET',
            url: 'http://localhost:3000/game/'+localStorage.getItem('id'),
            headers: {
                "jwttoken": localStorage.getItem('data')
            }
        });
        if(games)
        {
            
            let templateString = ``;
            for(let game of games)
            {
                templateString+=`<tr>
                        <th style="vertical-align:baseline;" scope="col">${game.quiz.title}</th>
                        <th style="vertical-align:baseline;" scope="col">${game.createdAt}</th>
                        <th style="vertical-align:baseline;" scope="col">${game.len}</th>
                        <th style="vertical-align:baseline;" scope="col" class = "quiz-foot"><button onclick="leaderBoard('${game.quiz._id}')" type = "button" Style="background-color: #8EE4AF;">></button>
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

function leaderBoard(quizId)
{
    window.location.href = '../tLeaderBoard.html?id='+quizId;
}