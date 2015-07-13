var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


/* bodyParser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(__dirname+'/public'), function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next();
});

app.get('/', function(req,res) {
  res.sendFile(__dirname+'/public/todoApp.html');
});


http.listen(2993);
