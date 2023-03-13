$(document).ready(()=>{ 

    let oid = 1, qid = 1;   
    $('#content').append(generateTString(qid));
    $('.username').html(localStorage.getItem('name'));
});


$('#done').click(async()=>{
    try
    {

        const questions = JSON.parse(localStorage.getItem('questions'));
        if(!questions)
        {
            alert("Please select atleast one question..!");
            return;
        }
        $('#spinner').css('display', 'block');
        const questionsObj = [];
        for(let question of questions)
        {
            const obj={
                title: question.q,
                options: [
                    {
                        title: question.op1,
                        isCorrect: 1==question.cop,
                    },
                    {
                        title: question.op2,
                        isCorrect: 2==question.cop,
                    },
                    {
                        title: question.op3,
                        isCorrect: 3==question.cop,
                    },
                    {
                        title: question.op4,
                        isCorrect: 4==question.cop,
                    }
                ]
            }
            questionsObj.push(obj);
        }
        const quiz = {  
            title:questions[0].qt,
            questions: questionsObj,
            creator: localStorage.getItem('id')
        }

        const response = await $.ajax({
            method:'POST',
            url: 'http://18.222.118.35:80/quiz/createQuiz',
            contentType:'application/json',
            headers: {
                "jwttoken": localStorage.getItem('data')
            },
            data: JSON.stringify(quiz),
        });
        if(response.success == true)
        {
            alert("Successfull quiz added");
            localStorage.removeItem('questions');
            location.reload();
        }  
        $('#spinner').css('display', 'none');
    }
    catch(error)
    {
        if(error.status == 400)
        {
            alert('You are unauthorized to create a quiz please login and try');
            console.log(error);
        }
    }
});

function addQuest(qid)
{
    $('#content').append(generateTString(qid+1));
}

const questions = [];
let qflag = false;
function save(qid)
{   
    
    const qt = $('#qtitle').val();
    const q = $('#q'+qid).val();
    const op1 = $('#op'+qid+'1').val();
    const op2 = $('#op'+qid+'2').val();
    const op3 = $('#op'+qid+'3').val();
    const op4 = $('#op'+qid+'4').val();
    const cop = $('#cp'+qid).val();

    if(q === ''|| op1 === ''|| op2 === ''|| op3 === ''|| op4 === ''|| cop === '')
    {
        alert("please fill all the required field");
        return;
    }
    else if(!qflag && qt ==='')
    {
        alert("please fill all the required field");
        return;
    }
    console.log(qt);
    let question;
    if(!qflag)
    {
         question = {
            qt: qt,
            qid: qid,
            q: q,
            op1: op1,
            op2: op2,
            op3: op3,
            op4: op4,
            cop: cop
        }
        qflag = true;
    }
    else
    {
         question = {
            qid: qid,
            q: q,
            op1: op1,
            op2: op2,
            op3: op3,
            op4: op4,
            cop: cop
        }       
    }
    
    questions.push(question);
    localStorage.setItem('questions', JSON.stringify(questions));
    alert('saved');
}


function cross(qid)
{
    console.log(qid);
    const index = questions.findIndex(obj=> obj.qid===qid);
    console.log(index);
    if(index !== -1)
    {
            questions.splice(index, 1);
    }
    localStorage.setItem('questions', JSON.stringify(questions));
    $('#wrapper'+qid).remove();
}

let flag = false;
function generateTString(qid)
{
    let oid = 1;
    const templateString = `<div id="wrapper${qid}"class = "wrapper mb-3">
    <div class = "quiz-container">  
        <div class = "quiz-body">
            <input id="q${qid}" class="form-control form-control-lg ml-5" type="text" placeholder="Start typing your question">
            <ul class = "quiz-options">   
                  <input id="op${qid}${oid++}" class="form-control form-control-lg mb-3 ml-5" type="text" placeholder="Start typing your option1" >
                  <input id="op${qid}${oid++}" class="form-control form-control-lg mb-3 ml-5" type="text" placeholder="Start typing your option2" >
                  <input id="op${qid}${oid++}" class="form-control form-control-lg mb-3 ml-5" type="text" placeholder="Start typing your option3" >
                  <input id="op${qid}${oid++}" class="form-control form-control-lg mb-3 ml-5" type="text" placeholder="Start typing your option4" >
            </ul>
        </div>
        <div class = "quiz-foot">
            <div class="row justify-content-evenly">
                <div class="cp col-md-2">
                    <input id="cp${qid}" class="form-control form-control-xs mb-3 ml-5" type="number" placeholder="1-4" style="width:70px">
                </div>
                <div class="cross col-md-2">
                    <button onclick="cross(${qid})" type = "button" id = "add${qid}" Style="background-color: lightcoral;">X</button>
                </div>
                <div class="add col-md-2">
                    <button onclick="addQuest(${qid})" type = "button" id = "add${qid}">+</button>
                </div>
                <div class="save col-md-2">
                    <button onclick="save(${qid})" type = "button" Style="background-color: #8EE4AF;">Save</button>
                </div>
            </div>
        </div>
    </div>
  </div>`;
  flag=true;
  return templateString;
}

function signOut()
{
    localStorage.clear();
    $.removeCookie('userData', {path: '/'});
    window.location.href = '/';
}