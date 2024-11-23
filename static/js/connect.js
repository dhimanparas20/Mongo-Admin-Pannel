$(document).ready(function () { 
    spinner(0);})


function spinner(val) {
    if (val === 1) {
        $('#loadingSpinner').removeClass('d-none');
    } else if (val === 0) {
        $('#loadingSpinner').addClass('d-none');
    }
    }
      