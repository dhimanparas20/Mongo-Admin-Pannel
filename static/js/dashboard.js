$(document).ready(function () { 
  console.log("Dashboard,js")
  spinner(0);
  $(document).on('click', '.database', function (event) {
      event.preventDefault();
      var databaseName = $(this).text();
      window.location.href=`/collection?dbname=${databaseName}`
  });

  $(document).on('click', '.collection', function (event) {
      event.preventDefault();
      // console.log("clicked");
      var collectionName = $(this).text();
      window.location.href=`/getdata?collectionName=${collectionName}` 
  });

  $(document).on('click', '.deletedb', function() {
    var itemName = $(this).parent().siblings('.subc1').find('.database').text();
    // console.log('Delete: ' + itemName);
    spinner(1);
    $.ajax({
        type: 'POST',
        url: '/deletedb',
        data: { name: itemName },
        success: function(response) {
            spinner(0);
            // console.log('Data sent successfully:', response);
            if (response === true) {
                location.reload();
            }
        },
        error: function(error) {
            spinner(0);
            console.error('Error sending data:', error);
            // Handle error response here if needed
        }
    });
  });

  $(document).on('click', '.deletecollection', function() {
    var itemName = $(this).parent().siblings('.subc1').find('.collection').text();
    // console.log('Delete: ' + itemName );
    spinner(1)
    $.ajax({
        type: 'POST',
        url: '/deletecollection', // Update with your server endpoint
        data: {dbname:dbname,collectionname:itemName},
        success: function(response) {
          spinner(0) 
          // console.log('Data sent successfully:', response);
          if (response === true){
            location.reload()
          }
  
        },
        error: function(error) {
          spinner(0) 
          console.error('Error sending data:', error);
          // Handle error response here if needed
        }
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
