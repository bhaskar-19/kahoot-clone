$(document).ready(async () => {
    try {
        let userData = Cookies.get("userData");
        userData = userData.replace(/^j:/, '');
        userData = JSON.parse(userData)
        
        if (userData.success) {
            if (userData.role === "") {
                localStorage.setItem('data', userData.token);
                localStorage.setItem('id', userData.id);
                localStorage.setItem('name', userData.name);
                window.location.href = './role.html';
            }
            else if (userData.role === 'student') {
                localStorage.setItem('data', userData.token);
                localStorage.setItem('id', userData.id);
                localStorage.setItem('name', userData.name);
                window.location.href = '/admin/studentDashboard.html';
            }
            else if(userData.role === 'teacher')
            {
                localStorage.setItem('data', userData.token);
                localStorage.setItem('id', userData.id);
                localStorage.setItem('name', userData.name);
                window.location.href = './admin/createQuiz.html';
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});