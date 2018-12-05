//require express- and http-modules
var express = require("express");
var http = require("http");
var websocket = require("ws")
var net = require("net");

//allow third argument in terminal to be port, usually 3000
var port = process.argv[2];

//let app be express
var app = express();

//make app into a static file server, make it listen on port (third argument in terminal)
app.use(express.static(__dirname + "/public"));

//create server, let it listen on port provided as third argument in terminal window
//callback function prints to console that server is started and it's listening for subscribers
http.createServer(app).listen(port, function () {
  console.log("Server started\nListening for subscribers...")
});

/*var server = net.createServer(function (connection) {

  //what to do on connect
});*/

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
