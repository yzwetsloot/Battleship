var express = require("express");
var http = require("http");
var websocket = require("ws")
var game = require("./gameClass");
var gameStatus = require("./statTracker");
var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

var server = http.createServer(app).listen(port, function () {
  console.log("Server started");
});

const wss = new websocket.Server({ server });
var websockets = {};

var currentGame = new game(gameStatus.gamesInitialized++);
var connectionID = 0; //unique id for websocket connection
var counter = 0;

wss.on("connection", function(ws) {
    setTimeout(function() {
        console.log("Connection state: "+ ws.readyState);
        ws.send("Waiting for opponent...");
        let con = ws;
        con.id = connectionID++;
        let playerType = currentGame.addPlayer(con);
        websockets[con.id] = currentGame;
        console.log("Player %s placed in game %s as %s",  con.id, currentGame.id, playerType);
        
        if (currentGame.hasTwoConnectedPlayers()) {
          currentGame = new game(gameStatus.gamesInitialized++);
        }


        ws.close();
        console.log("Connection state: "+ ws.readyState);
    }, 2000);

    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message + " " + connectionID);

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



