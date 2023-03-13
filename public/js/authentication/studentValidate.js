$(document).ready(()=>{
    console.log(localStorage.getItem('name'));
    $('.username').html(localStorage.getItem('name'));
})

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
            url: 'http://18.222.118.35:80/authentication/validate'
        });
        console.log(data);
        if(data.success && data.role === 'student')
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
            console.log("Errorr")
            window.location.href = '/error.html'
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

function signOut()
{
    localStorage.clear();
    $.removeCookie('userData', { path: '/'});
    window.location.href = '/';
}