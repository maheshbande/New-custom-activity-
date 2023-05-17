console.log('postmonger activity')

var connection = new Postmonger.Session();

// Startup Sequence
connection.trigger('ready');

connection.on('initActivity', function (data) {
  document.getElementById('configuration').value = JSON.stringify(data, null, 2);
  console.log(data);
});

// Save Sequence
connection.on('clickedNext', appendstring);
function appendstring() {
  var payload = {};

  var configuration = JSON.parse(document.getElementById('configuration').value);



  payload = configuration;
  payload["arguments"].execute.inArguments = [{

    recipient: {

      Country: "India",
      contactdata: [{
        "First_Name": "{{Event.DEAudience-2d0759c5-f929-b434-a04d-d20589423d22.First_Name}}"
      },
      {
        "Last_Name": "{{Event.DEAudience-2d0759c5-f929-b434-a04d-d20589423d22.Last_Name}}"
      },
      {
        "Email_Address": "{{Event.DEAudience-2d0759c5-f929-b434-a04d-d20589423d22.Email_Address}}"
      },
      {
        "Device_Id": "{{Event.DEAudience-2d0759c5-f929-b434-a04d-d20589423d22.Device_Id}}"
      },
      {
        "Contact_Key": "{{Event.DEAudience-2d0759c5-f929-b434-a04d-d20589423d22.Contact_Key}}"
      },
      {
        "Contact key ": "{{Contact.Key}}"
      }
      ]
    }
  }];
  payload["metaData"].isConfigured = true;
  connection.trigger("updateActivity", payload);
}