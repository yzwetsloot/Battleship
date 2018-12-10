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

//check whether move made is equal to boat position
function checkMove (move, arr) {
  let a = 0;
  let b = move.substring(1);
  for(var i = 0; i < arr.length; i++) {
    if (arr[i] == b) {
      a = b;
      return a;
    }
  }
  return a;
}

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

  con.on("message", function incoming(message) {
    
    let gameObj = websockets[con.id];

    if (message == "Client ready" && con == gameObj.playerA) {
      gameObj.playerA.send("It's your turn");
      gameObj.playerB.send("It's player A's turn");
      console.log("[LOG] " + message);
    }
    //gets executed twice for some reason
    if (message.includes("Move: ") && con == gameObj.playerA) {
      console.log("[LOG] " + message + " [CONNECTION]: " + con.id);
      let a = checkMove(message, arr);
      if (a == 0) {
        
        gameObj.playerB.send("It's your turn");
        gameObj.playerA.send("It's B's turn");
      }

      if (a != 0) {
        
        gameObj.playerA.send("It's your turn");
        gameObj.playerB.send("It's A's turn")
      }
    }
    
    if (message.includes("Move: ") && con == gameObj.playerB) {
      console.log("[LOG] " + message + " [CONNECTION]: " + con.id);
      let a = checkMove(message, arr);
      if (a == 0) {
        
        gameObj.playerA.send("It's your turn");
        gameObj.playerB.send("It's A's turn");
      }

      if (a != 0) {
        
        gameObj.playerB.send("It's your turn");
        gameObj.playerA.send("It's A's turn")
      }

    }
    if (message == "Hello from client") {
      console.log("[LOG] " + message + " " + (connectionID - 1));
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




