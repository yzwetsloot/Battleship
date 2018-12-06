//require express- and http-modules
var express = require("express");
var http = require("http");
var websocket = require("ws")

//allow third argument in terminal to be port, usually 3000
var port = process.argv[2];

//let app be express object
var app = express();

//make app into a static file server, make it listen on port (third argument in terminal)
app.use(express.static(__dirname + "/public"));

//create server, let it listen on port provided as third argument in terminal window
//callback function prints to console that server is started
var server = http.createServer(app).listen(port, function () {
  console.log("Server started");
});

const wss = new websocket.Server({ server });

wss.on("connection", function(ws) {
    //let's slow down the server response time a bit to make the change visible on the client side
    setTimeout(function() {
        console.log("Connection state: "+ ws.readyState);
        ws.send("Thanks for the message. --Your server.");
        ws.close();
        console.log("Connection state: "+ ws.readyState);
    }, 2000);

    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message);
    });
});

//setup root route, response splash.html from root /public
app.get('/', function(req, res) {
  res.sendFile("splash.html", {root: "./public"});
});

//setup route /play which loads game.html
app.get("/play", function(req, res) {
  res.sendFile("game.html", {root: "./public"});
});

app.get("/*", function(req, res) {
  res.send("Not a valid route...");
})

//variables for statistics
var gamesPlayed;

var playersOnline;

var boatsSunk;
