async function teacher() {
    try
    {
        const id = {
            id: localStorage.getItem('id')
        };
        
        const data = await $.ajax({
            method: 'POST',
            url: 'http://18.222.118.35:80/authentication/updateRole',
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