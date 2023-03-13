$(document).ready(async()=>{
    $('.username').html(localStorage.getItem('name'));
    try
    {
        const uid = localStorage.getItem('id');
        const jwttoken = localStorage.getItem('data');
        const data = await $.ajax({
            headers: {
                "jwttoken": jwttoken
            },
            method: 'GET',
            url: 'http://18.222.118.35:80/quiz/quizzes/'+uid
        });
        if(data.quizzes)
        {
            const quizzes = data.quizzes;
            let templateString = ``;
            for(let quiz of quizzes)
            {
                templateString+=`<tr>
                        <th style="vertical-align:baseline;" scope="col">${quiz.title}</th>
                        <th class = "col-md-3"style="vertical-align:baseline;" scope="col"><input id="${quiz.title}" class="form-control form-control-xs col-3" type="text" placeholder="Batch">
                        </th>
                        <th style="vertical-align:baseline;" scope="col" class = "quiz-foot"><button onclick="startGame('${quiz.title}','${quiz._id}')" type = "button" Style="background-color: #8EE4AF;">Start</button>
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


function startGame(title, id)
{
    let qtitle = $('#'+title).val();
    qtitle = qtitle.replace(/\s+/g, '');
    console.log(qtitle)
    if(qtitle === undefined || qtitle===null)
    {
        alert("Please Enter Batch Name");
        return;
    }
    window.location.href="../host.html?id="+id+"&batch="+qtitle;
}


function signOut()
{
    localStorage.clear();
    $.removeCookie('userData', {path: '/'});
    window.location.href = '/';
}