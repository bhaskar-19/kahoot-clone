async function validate()
{
    try
    {
        var token = localStorage.getItem('data');
        const data = await $.ajax({
            headers: {
                "jwttoken": token
            },
            method: 'GET',
            url: 'http://localhost:3000/authentication/validate'
        });
        if(data)
        {
            $(".loaderDiv").remove();
            $("body").css("position",'');
            $("body").css("height",'');
            $("body").css("width",'');
            $("body").css("z-index",'');
            $("body").css("background-color",'');
        }
        else
        {
            window.location.href = '/public/error.html'
        }
    }
    catch(error)
    {
        if(error.status == 400)
        {
            window.location.href = '../error.html';
        }
    }
}
validate()