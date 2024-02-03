$(document).ready(function() {
    spinner(0)
    $('#message').text("");
    $('#form').submit(function(event) {
      event.preventDefault();
      var formData = new FormData(this); 
      spinner(1)
      fetch('/connect', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        spinner(0) 
        // console.log(data)
        if (data['msg']==="Success"){
          $('#message').text("Success");
          window.location.href="/"
        }
        else if (data['msg']==="Invalid Credentials or String"){
          $('#message').text("Invalid Credentials or String");
        }
      })
      .catch(error => {
        spinner(0)
        console.error('Error during fetch:', error);
      });
    });
  });
  

  function spinner(val) {
    if (val === 1) {
      $('#loadingSpinner').removeClass('d-none');
    } else if (val === 0) {
      $('#loadingSpinner').addClass('d-none');
    }
  }

  function resetForm() {
    $('#message').text("");
    var form = document.getElementById('form');
    form.reset();
}  