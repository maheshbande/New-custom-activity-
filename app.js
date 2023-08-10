const express = require('express');
 require("dotenv").config();
 
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const path = require('path');
const router = express.Router();
const axios = require('axios');
let authToken = null;
var now = new Date();
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    //__dirname : It will resolve to your project folder.
});
app.use('/', router);
app.listen(process.env.PORT || 3000, () => {
    console.log('process env'+(process.env.PORT) );
    console.log('Custom Activity is up and runing!');
    getAuthToken();
});
app.post('/save', function (req, res) {
    console.log('debug:save' + now);
    return res.status(200).json({});
});
app.post('/publish', function (req, res) {
    console.log('debug:publish' + now);
    return res.status(200).json({});
});
app.post('/stop', function (req, res) {
    console.log('debug:stop' + now);
    return res.status(200).json({});
});
app.post('/validate', function (req, res) {
    console.log('debug:validate' + now);
    return res.status(200).json({});
});

console.log('Custom Activity is up');
console.log('PORT '+(process.env.DEV_PORT));

 getAuthToken = async () => {
    const response = await axios.post('https://mctj9h-m0vnm4djsbg0sd62mz8lm.auth.marketingcloudapis.com/v2/token', {
        // Include any necessary request parameters for authentication
        "client_id": "XXxxxxxx",
        "client_secret": "XXXXXXXX",
         "account_id" : "514013751",
        "grant_type": "client_credentials"
    });
    authToken = response.data; // Store the auth token in a variable
    console.log('Token Data'+JSON.stringify(response.data));
    var client = process.env.API_ENDPOINT;
    console.log('PORT '+client);
    console.log('Auth Token '+(authToken.access_token));
};

setInterval(getAuthToken, 0.5 * 60 * 1000); // Call getAuthToken() initially and every 40 minutes thereafter

app.post('/excute', async (req, res) => {
    const data = req.body; // Get the data to post from the request body
    console.log('Payload Data Recieved '+JSON.stringify(data));
    //console.log('Payload Data2 '+data);
   // console.log('Payload Data3 '+JSON.stringify(req));
    try {
        const response = await axios.post('https://mctj9h-m0vnm4djsbg0sd62mz8lm.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:API_Data/rows', {"items": [{
            "Json_Batch":JSON.stringify(data.inArguments[0].recipient)
         }]
        }, {
            headers: {
                'Authorization': "Bearer"+" "+authToken.access_token,// Include the auth token in the request headers
                'Content-Type': 'application/json'
            }
        });
        console.log('Response Payload Data'+(response.data));
        res.json(response.data); // Send the response from the API call to the client
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // If the error response indicates an invalid auth token, get a new auth token and retry the API call
            await getAuthToken();
            const response = await axios.post('https://mctj9h-m0vnm4djsbg0sd62mz8lm.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:API_Data/rows', {
                data,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}` // Include the new auth token in the request headers
                }
            });

            res.json(response.data); // Send the response from the retry API call to the client
        } else {
            console.error(error); // Log any other errors that occur during the API call
            res.status(500).send('Error posting data to third-party API');
        }
    }
});
