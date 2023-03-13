const form = document.querySelector('#registerForm');
form.addEventListener('submit',  (event) => {
  event.preventDefault(); // Prevent the form from submitting
  const form = document.querySelector('#registerForm');
  const password1 = $('#password1').val();
  const password2 = $('#password2').val();
  if(password1!==password2)
  {
    $('#mess').html('');
    const templateString =  `<p class="text-center " style="color:red">Password doesn't matched</p>`;
    $('#mess').append(templateString);
    return;
  }
  const formData = new FormData(form);
  const formDataObj = Object.fromEntries(formData.entries());
  if(formDataObj.firstName === ''|| formDataObj.lastName==='' || formDataObj.email === '' || formDataObj.password === '' ||formDataObj.role === 'none')
  {
    $('#invalid').html('');
    const templateString = `<p class="text-center " style="color:red">Please fill all required field</p>`;
    $('#invalid').append(templateString);
    return;
  }
  $.ajax({
    method:'POST',
    data : JSON.stringify(formDataObj),
    url: 'http://18.222.118.35:80/authentication/signup',
    contentType: 'application/json',
    success:(data)=>
    {
        alert("Successful Go and login ");
        window.location.href = '../login.html'
    },
    error:(error)=>{
        alert("Unsuccessful"+error);
        location.reload();
    }
  });
});