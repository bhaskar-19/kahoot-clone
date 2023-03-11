async function teacher() {
    try
    {
        const id = {
            id: localStorage.getItem('id')
        };
        
        const data = await $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/authentication/updateRole',
            data: JSON.stringify(id),
            contentType: 'application/json'
        });
        if(data.success)
        {
            window.location.href='/admin/createQuiz.html';
        }
    }
    catch(error)
    {
        console.log(error);
    }
}