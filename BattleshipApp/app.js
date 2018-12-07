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

//callback function gets called after timeout of 2 secs everytime a connection is established
wss.on("connection", function(ws) {
    setTimeout(function() {
        console.log("Connection state: "+ ws.readyState);
        ws.send("Waiting for opponent...");
        let con = ws;
        con.id = connectionID++;
        let playerType = currentGame.addPlayer(con);
        websockets[con.id] = currentGame;
        console.log("Player %s placed in game %s as %s",  con.id, currentGame.id, playerType);
        con.send((playerType == "A") ? "You are player A" : "You are player B");

        if (currentGame.hasTwoConnectedPlayers()) {
          currentGame = new game(gameStatus.gamesInitialized++);
        }
        
        
        //setTimeout(function() {con.send("Game started")}, 2000);

        //ws.close();
        console.log("Connection state: "+ ws.readyState);
    }, 2000);

    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message + " " + connectionID);

    });

    con.on("close", function(code) {
      console.log(con.id + " disconnected... ");

      let gameObj = websockets[con.id];

      if (code == "1001") {
        gameObj.setStatus("ABORTED");
        gameStatus.gamesAborted++;

        try {
          gameObj.playerA.close();
          gameObj.playerA == null;
        }

        catch (e) {
          console.log("Player A closing: "+ e);
        }

        try {
          gameObj.playerB.close();
          gameObj.playerB.close();
        }

        catch (e) {
          console.log("Player B closing: " + e);
        }
      }
    })
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



