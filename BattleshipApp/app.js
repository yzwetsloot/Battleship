//require express- and http-modules
var express = require("express");
var http = require("http");

//allow third argument in terminal to be port 
var port = process.argv[2];

//let app be express
var app = express();

//make app into a static file server, make it listen on port (third argument in terminal)
app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

//setup root route, response splash.html from root /public
app.get('/', function(req, res, next) {
  res.sendFile("splash.html", {root: "./public"});
});

//setup route /play which loads game.html
app.get("/play", function(req, res,next) {
  res.sendFile("game.html", {root: "./public"});
});

//variables for statistics
var gamesPlayed;

var playersOnline;

var boatsSunk;