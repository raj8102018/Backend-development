require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// Arrays to store original and short URLs
const originalUrls = [];
const shortUrls = [];

// Function to check if a URL is valid
function isValidUrl(url) {
  // Check if the URL starts with 'http://' or 'https://'
  return url.startsWith('http://') || url.startsWith('https://');
}

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  // Check for valid URL format
  if (!isValidUrl(url)) {
    return res.json ({error: 'Invalid URL'});
  }

  // Check if the URL already exists
  const foundIndex = originalUrls.indexOf(url);
  if (foundIndex < 0) {
    // If the URL doesn't exist, add it to the arrays
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);
    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    });
  }

  // If the URL already exists, return its short URL
  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex]
  });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = req.params.shorturl;
  const foundIndex = shortUrls.indexOf(parseInt(shorturl));

  if (foundIndex < 0) {
    return res.json({
      "error": "No short URL found for the given input"
    });
  }

  // Redirect to the original URL
  res.redirect(originalUrls[foundIndex]);
});
