$(document).ready(async ()=>{
    const params = new URLSearchParams(window.location.search);
    try
    {
        const batchId = params.get('id');
        
        const jwttoken = localStorage.getItem('data');
        const batchData = await $.ajax({
            method: 'GET',
            url: 'http://18.222.118.35:80/game/batchBoard/'+batchId,
            headers: {
                "jwttoken": jwttoken
            }
        });
       
        if(batchData.success)
        {
            
            let templateString = ``;
            let id = 1;
            for(let player of batchData.batch)
            {
                templateString+=`<tr>
                        <th style="vertical-align:baseline;" scope="col">${id++}</th>
                        <th style="vertical-align:baseline;" scope="col">${player.name}</th>
                        <th style="vertical-align:baseline;" scope="col" class = "quiz-foot">${player.score}</th>
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


function home()
{
    window.location.href = './admin/createQuiz.html';
}