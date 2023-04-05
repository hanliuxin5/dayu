const express = require('express')

var app = express();

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})

app.get('/process_get', function (req, res) {

  var response = {
    "question": req.query.first_name,
  };

  res.end(JSON.stringify(response));
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

})