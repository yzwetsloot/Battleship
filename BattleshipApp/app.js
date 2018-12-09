var express = require("express");
var http = require("http");
var websocket = require("ws")
var game = require("./gameClass");
var gameStatus = require("./statTracker");
var port = process.argv[2];
var app = express();
//////////////////////////////
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app).listen(port, function () {
  console.log("Server started");
});

const wss = new websocket.Server({ server });
var websockets = {};

setInterval(function () {
  for (let i in websockets) {
    if (websockets.hasOwnProperty(i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        console.log("\tDeleting element " + i);
        delete websockets[i];
      }
    }
  }
}, 50000);

var currentGame = new game(gameStatus.gamesInitialized++);
var connectionID = 0; //unique id for websocket connection

//callback function gets called after timeout of 2 secs everytime a connection is established
wss.on("connection", function (ws) {
  gameStatus.playersOnline++;
  let con;

  //setTimeout(function() {
  console.log("Connection state: " + ws.readyState);
  ws.send("Waiting for opponent...");
  con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;
  console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);
  con.send((playerType == "A") ? "You are player A" : "You are player B");

  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame.playerA.send("Game started");
    currentGame.playerB.send("Game started");
    currentGame = new game(gameStatus.gamesInitialized++);
  }

  console.log("Connection state: " + ws.readyState);
  //}, 2000);

  con.on("message", function incoming(message) {

    let gameObj = websockets[con.id];
    if (message == "Ready from client" && gameObj.playerB == con) {
      gameObj.playerA.send("It's your turn");
      gameObj.playerB.send("It's player A's turn");
    }
    else {
      console.log("[LOG] " + message + " " + connectionID);
    }

  });

  con.on("close", function (code) {
    console.log(con.id + " disconnected... ");
    gameStatus.playersOnline--;
    let gameObj = websockets[con.id];

    if (code == "1001") {
      gameObj.setStatus("ABORTED");
      gameStatus.gamesAborted++;
      con.id--;
      try {
        gameObj.playerA.close();
        gameObj.playerA == null;
      }

      catch (e) {
        console.log("Player A closing: " + e);
      }

      try {
        gameObj.playerB.close();
        gameObj.playerB == null;
        con.id--;
      }

      catch (e) {
        console.log("Player B closing: " + e);
      }
    }
  })
});

//setup root route, response splash.html from root /public
/*app.get('/', function(req, res) {
  res.sendFile("splash.html", {root: "./public"});
});*/

app.get('/', function (req, res) {
  res.render("splash.ejs", { gamesStarted: (gameStatus.gamesInitialized - 1) - gameStatus.gamesAborted, playersOnline: gameStatus.playersOnline, gamesCompleted: gameStatus.gamesCompleted });
});

//setup route /play which loads game.html
app.get("/play", function (req, res) {
  res.sendFile("game.html", { root: "./public" });
});

app.get("/*", function (req, res) {
  res.send("Not a valid route...");
});




