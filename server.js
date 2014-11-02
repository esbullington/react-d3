var fs = require("fs");
var port = 4000;
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/static', function(req, res) {
  res.sendFile(__dirname + '/dist/barchart.html');
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

console.log('Listening on port ' + port);
app.listen(port);
