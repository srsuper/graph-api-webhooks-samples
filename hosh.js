
var express = require('express');
var bodyParser = require('body-parser')
var crypto = require('crypto');

// Calculate the X-Hub-Signature header value.
function getSignature(buf) {
  var hmac = crypto.createHmac("sha1", process.env.FB_APP_SECRET);
  hmac.update(buf, "utf-8");
  return "sha1=" + hmac.digest("hex");
}

// Verify function compatible with body-parser to retrieve the request payload.
// Read more: https://github.com/expressjs/body-parser#verify
function verifyRequest(req, res, buf, encoding) {
  var expected = req.headers['x-hub-signature'];
  var calculated = getSignature(buf);
  console.log("X-Hub-Signature:", expected, "Content:", "-" + buf.toString('utf8') + "-");
  if (expected !== calculated) {
    throw new Error("Invalid signature.");
  } else {
    console.log("Valid signature!");
  }
}

// Express error-handling middleware function.
// Read more: http://expressjs.com/en/guide/error-handling.html
function abortOnError(err, req, res, next) {
  if (err) {
    console.log(err);
    res.status(400).send({ error: "Invalid signature." });
  } else {
    next();
  }
}

var app = express();
var listener = app.listen(process.env.PORT ? process.env.PORT : 3000);

// body-parser is the first Express middleware.
app.use(bodyParser.json({ verify: verifyRequest }))

// Add an error-handling Express middleware function 
// to prevent returning sensitive information.
app.use(abortOnError);

app.post('/webhook/', function (req, res) {
  res.status(200).send("done!");
});
