$(document).ready(async()=>{
    try
    {
        const uid = localStorage.getItem('id');
        const jwttoken = localStorage.getItem('data');
        const data = await $.ajax({
            headers: {
                "jwttoken": jwttoken
            },
            method: 'GET',
            url: 'http://localhost:3000/quiz/quizzes/'+uid
        });
        console.log(data);
        if(data.quizzes)
        {
            const quizzes = data.quizzes;
            let templateString = ``;
            let id = 1;
            for(quiz of quizzes)
            {
                templateString+=`<tr>
                        <th style="vertical-align:baseline;" scope="col">${quiz.title}</th>
                        <th style="vertical-align:baseline;" scope="col" class = "quiz-foot"><button onclick="startGame('${quiz._id}')" type = "button" Style="background-color: #8EE4AF;">Start</button>
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
        alert('Unauthorized to get your quizzes');
    }
});


function startGame(id)
{
    window.location.href="../host.html?id="+id;
}