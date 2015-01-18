var fs = require("fs");
var port = 4000;
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/dist/public'));

app.get('/static', function(req, res) {
  res.sendFile(__dirname + '/dist/public/barchart.html');
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/public/index.html');
});

console.log('Listening on port ' + port);
app.listen(port);
