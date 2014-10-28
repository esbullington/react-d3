var fs = require("fs");
var port = 4000;
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(port);
