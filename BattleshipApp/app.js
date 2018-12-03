var express = require("express");
var http = require("http");
var router = express.Router();


var port = process.argv[2];

var app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get('/', function(req, res, next) {
  res.sendFile("splash.html", {root: "./public"});
});


app.get("/play", function(req, res,next) {
  res.sendFile("game.html", {root: "./public"});
});

