const form = document.querySelector('#loginForm');
form.addEventListener('submit', async (event) => {
  try
  {
        event.preventDefault(); // Prevent the form from submitting

        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        const data = await $.ajax({
            method:'POST',
            data : JSON.stringify(formDataObj),
            url: 'http://18.222.118.35/authentication/signin',
            contentType: 'application/json'
        });
        if(data.role==='teacher')
        {
            localStorage.setItem('data', data.token);
            localStorage.setItem('id', data.id);
            localStorage.setItem('name', data.name);
            window.location.href='./admin/createQuiz.html'; 
        }
        else if(data.role === 'student')
        {
            localStorage.setItem('data', data.token);
            localStorage.setItem('id', data.id);
            localStorage.setItem('name', data.name);
            window.location.href='/admin/studentDashboard.html';
        }
  }
  catch(error)
  {
    if (error.status === 400) 
    {
        const templateString = `<p class="text-center fw-bold mx-3 mb-0" style="color: red">${error.responseText} </p>`
        $(".message").html(templateString);
    } 
    else 
    {
        console.error(error);
    }
  }
});

$(document).ready(()=>{


    $('#google').click(async ()=>{
        try
        {
            window.location.href = 'http://18.222.118.35:80/authentication/login';
        }
        catch(error)
        {
            console.log(error);
        }
    })
})