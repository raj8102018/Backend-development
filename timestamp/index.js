// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


let outputObject = {}

app.get('/api/:date?', (req, res) => {
  let date_string = req.params.date;
  let outputObject = {};

  if (!date_string) {
    // If date_string is empty, use the current time
    outputObject['unix'] = new Date().getTime();
    outputObject['utc'] = new Date().toUTCString();
    res.json(outputObject);
    return;
  }

  let date = new Date(date_string);

  if (!isNaN(date.getTime())) {
    // If parsing the date string as a date object is successful
    outputObject['unix'] = date.getTime();
    outputObject['utc'] = date.toUTCString();
  } else if (!isNaN(parseInt(date_string))) {
    // If the date string is a valid UNIX timestamp
    let unixTime = parseInt(date_string);
    outputObject['unix'] = unixTime;
    outputObject['utc'] = new Date(unixTime).toUTCString();
  } else {
    // If the date string is invalid
    outputObject['error'] = 'Invalid Date';
  }

  res.json(outputObject);
});


