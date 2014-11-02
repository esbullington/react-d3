var fs = require("fs");
var port = 4000;
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});

console.log('Listening on port ' + port);
app.listen(port);
