$(document).ready(function () {
  spinner(0)
  $('#container').empty();

  $(document).on('click', '#reloadbutton', function (event) { //reload page when clicked 
    event.preventDefault();
    location.reload();
  });

  jsonData.forEach(function(item, index) {  //Display data on load 
    var h3 = $('<h3>').text(`${index + 1}. `);
    var a = $('<a>').addClass('data').text(item[0]);
    // Create a delete button
    var deleteButton = $('<button>').addClass('delete btn btn-danger').text('Delete').attr('data-id', item['_id']);

    // Create a modify button
    var modifyButton = $('<button>').addClass('modify btn btn-info').text('Modify').attr('data-id', index);

    // Create a table for the main item
    var mainTable = createTable(item);

    // Append the h3, a, delete button, modify button, main table, and an <hr> tag to separate different index data
    $('#container').append(h3, a, mainTable, deleteButton, modifyButton, '<hr>');
  });

  $(document).on('click', '.modify', function(event) {  // Add click event for the modify button
      event.preventDefault();
      $('#container').empty();
      $('#heading').text("Modify Data");

      // Create a form for modification
      var modifyForm = $('<form id="modifyForm">') //.attr('id', 'modifyForm');
      $('#container').append(modifyForm);

      createModifyForm(jsonData[$(this).data('id')]);  // Pass the item data to the form creation function
      // $('#container').append(modifyForm);
  });
  
  function createModifyForm(item) {  // Function to create the modification form
      for (var key in item) {
        // Check if the key is "_id"
        if (key === '_id') {
          // Create a read-only input field for "_id"
          input = $('<input>').attr({
              'type': 'text',
              'name': key,
              'value': item[key],
              'readonly': true
          });
        } else {
            // Create a regular input field for other keys
            input = $('<input>').attr({
                'type': 'text',
                'name': key,
                'value': item[key]
            });
        }
      var backButton = $('<button id="reloadbutton" style="margin-left: 10px;">').addClass('btn btn-info').text('Back');  
      var label = $('<label>').text(key+" : ");
      $('#modifyForm').append(label, input, '<br>');
      }

      // Create a modify button for the form
      var modifyButton = $('<button>').addClass('btn btn-info modifySubmit').text('Modify').attr('type', 'button');
      $('#modifyForm').append(modifyButton,backButton);
  }

  $(document).on('click', '.modifySubmit', function(event) { // Add click event for the modifySubmit button
    event.preventDefault();
    var data = $('#modifyForm').serializeArray();
    // Convert array to object
    let jsonData = {};
    data.forEach(item => {
        // Parse JSON for values that look like JSON objects or arrays
        try {
            item.value = JSON.parse(item.value);
        } catch (error) {
            // Ignore the error if parsing fails, it means the value is not JSON
        }

        jsonData[item.name] = item.value;
    });
    // Convert the object to JSON string
    let jsonString = JSON.stringify(jsonData);
    $.ajax({
        type: 'POST',
        url: '/update', // Update with your server endpoint
        data: JSON.stringify(JSON.parse(jsonString)),
        contentType: 'application/json',
        success: function(response) {
            spinner(0) 
            if (response === true){
                location.reload()
            }
            else{
              alert(response['message'])
            }
        },
        error: function(error) {
            spinner(0) 
            console.error('Error sending data:', error);
            // Handle error response here if needed
        }
    });
  });

  $(document).on('click', '#rawjson', function (event) {  // Show Data in JSON Format
    event.preventDefault();
    $('#container').empty();
    $('#heading').text("Raw Json");
    $('#rawjson').text("Back")
    
    $(document).on('click', '#rawjson', function (event) {
        event.preventDefault();
        location.reload();
    });
    
    jsonData.forEach(function(item, index) {
        var h3 = $('<h3>').text(`${index + 1}. `);
        var a = $('<a>').addClass('data').text(item[0]);

        // Create a delete button
        var deleteButton = $('<button>').addClass('delete btn btn-danger').text('Delete').attr('data-id', item['_id']);

        // Create a copy button
        var copyButton = $('<button>').addClass('copy btn btn-primary').text('Copy JSON').attr('data-json', JSON.stringify(item));

        // Convert the object to a formatted JSON string
        var jsonString = formatJSON(JSON.stringify(item));

        // Use <pre> to preserve formatting
        var pre = $('<pre>').text(jsonString);

        // Append the JSON data, delete button, copy button, and an <hr> tag to separate different index data
        $('#container').append(h3, a, pre, deleteButton, copyButton, '<hr>');
    });

    // Add click event for copy button
    $(document).on('click', '.copy', function (event) {
        var jsonToCopy = $(this).attr('data-json');
        
        // Copy formatted JSON to clipboard
        navigator.clipboard.writeText(jsonToCopy).then(function() {
            alert("copied!")
            // console.log('JSON copied to clipboard:', jsonToCopy);
            // You can add a notification or any other action after copying
        }).catch(function(err) {
            alert("error! Try Again")
            console.error('Error copying JSON to clipboard:', err);
        });
    });
  });

  $(document).on('click', '#insertdata', function (event) {  //Insert Data into DB
    event.preventDefault();
    $('#container').empty();
    $('#heading').text("Insert Data")
    $('#insertdata').text("Back")
    $(document).on('click', '#insertdata', function (event) {
      event.preventDefault();
      location.reload();
    });
    var form = $('<form id="insertform">');
    keys.forEach(function (item, index) {
      var type = "text"
      if (item['type']==="int"){
        type = "number"
      }
      else if (item['type']==="float"){
        type = "number"
      }
      var input = $('<br><input>')
        .attr('type', type)
        .attr('name', item['name'])
        .attr('placeholder', item['name']);

      form.append(input);
    });
    // Create a submit button
    var submitButton = $('<br><button type="submit" class="btn btn-success">')
      .attr('type', 'submit')
      .text('Submit');
    form.append(submitButton);
    // Append the form to the container
    $('#container').append(form);

    $(document).on('submit', '#insertform', function (event) {
      event.preventDefault();
      var data = $('#insertform').serializeArray();
        // Convert array to object
        let jsonData = {};
        data.forEach(item => {
          jsonData[item.name] = item.value;
        });
        // Convert the object to JSON string
        let jsonString = JSON.stringify(jsonData);
        spinner(1)
        $.ajax({
            type: 'POST',
            url: '/insert', // Update with your server endpoint
            data: JSON.stringify(JSON.parse(jsonString)),
            contentType: 'application/json',
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

  $(document).on('click', '#insertjsondata', function (event) {  //Insert JSON data to DB
    event.preventDefault();
    $('#container').empty();
    $('#heading').text("Insert Json");
    $('#insertjsondata').text("Back")
    $(document).on('click', '#insertjsondata', function (event) {
      event.preventDefault();
      location.reload();
    });
    // Replace #container with a textarea
    var textarea = $('<textarea>')
    .attr('id', 'jsonInput')
    .attr('placeholder', 'Enter JSON data here...')
    .css('width', '80%')  // Set width to 100%
    .css('height', '150px')  // Set an initial height (adjust as needed)
    .css('resize', 'both')  // Allow both horizontal and vertical resizing
    .css('overflow', 'auto');  // Add a scrollbar if needed
    $('#container').append(textarea);
    // Add a button for validation and AJAX request
    var submitButton = $('<button>').addClass('btn btn-primary').text('Submit').attr('id', 'submitJson');
    $('#container').append(submitButton);
    // Validation and AJAX request on clicking submit button
    $(document).on('click', '#submitJson', function () {
      var jsonData = $('#jsonInput').val();
      try {        
        // Data is valid, send it using AJAX
        $.ajax({
          type: 'POST',
          url: '/insertjson', // Update with your server endpoint
          contentType: 'application/json',
          data: JSON.stringify(JSON.parse(jsonData)) ,
          success: function (response) {
            spinner(0);
            // console.log('Data sent successfully:', response);
            if (response === true) {
              location.reload();
            }
          },
          error: function (error) {
            spinner(0);
            console.error('Error sending data:', error);
            // Handle error appropriately
          }
        });
      } catch (e) {
        // JSON parsing failed, handle the error (e.g., display an error message)
        alert("invalid JSON")
        console.error('Error parsing JSON:', e);
      }
    });
  });

  $(document).on('click', '.delete', function (event) {  // Handle the delete button click event
    var itemId = $(this).data('id');
    spinner(1)
    $.ajax({
        type: 'POST',
        url: '/delete', // Update with your server endpoint
        data: {id:itemId},
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

})

// Helper function to format JSON string with indentation
function formatJSON(jsonString) {
  try {
      const parsedJSON = JSON.parse(jsonString);
      return JSON.stringify(parsedJSON, null, 2);
  } catch (error) {
      console.error('Error formatting JSON:', error);
      return jsonString;
  }
}
function createTable(obj) {
  var table = $('<table>').addClass('table table-bordered');
  // Iterate through the keys and values of the object
  // console.log(obj)
  for (var key in obj) {
    if (!isNaN(key)) {
      // Convert key to a number if needed
      var key = parseInt(key);
      // console.log(key, obj[key]);
    } else {
      // console.log(key, obj[key]);
    }
      var row = $('<tr>');
      row.append($('<td>').text(key+" : "));
      var type = "text"
      if (typeof(obj[key])==="number"){
        type = "number"
      }
      if (typeof obj[key] === 'object') {
          // If the value is an object, recursively create a sub-table
          var subTable = createTable(obj[key]);
          row.append($(`<td data-type=${type}> `).append(subTable));
      } else {
          // If the value is not an object, display it directly
          row.append($(`<td data-type=${type}>`).text(obj[key]));
      }

      table.append(row);
  }

  return table;
} 
function spinner(val) {
    if (val === 1) {
        $('#loadingSpinner').removeClass('d-none');
    } else if (val === 0) {
        $('#loadingSpinner').addClass('d-none');
    }
}
 