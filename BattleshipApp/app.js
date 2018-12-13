var express = require("express");
var http = require("http");
var websocket = require("ws")
var cookie = require("cookie-parser");
var game = require("./gameClass");
var gameStatus = require("./statTracker");
var port = process.argv[2];
var app = express();

app.use(cookie());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app).listen(port, function () {
  console.log("Server started");
});

const wss = new websocket.Server({ server });
var websockets = {};

function checkMove (move, arr) {
  var a = 0;
  var b = move.substring(1);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == b) {
      a = b;
      break;     
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

wss.on("connection", function (ws) {
  gameStatus.playersOnline++;
  gameStatus.gamesInitialized++;
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

    else if (message == "Client ready" && con == gameObj.playerB) {

    }

    else if (message == "Win" && con == gameObj.playerA) {
      gameObj.playerA.send("You won");
      gameObj.playerB.send("You lost");
      setTimeout(function() {
        gameObj.playerA.send("Click 'Home' to play another game!");
        gameObj.playerB.send("Click 'Home' to play another game!");
        gameObj.playerA.close();
        gameObj.playerB.close();
      }, 3000);
      
      
      gameStatus.gamesInitialized--;
      gameStatus.gamesCompleted++;
    }

    else if (message == "Win" && con == gameObj.playerB) {
      gameObj.playerA.send("You lost");
      gameObj.playerB.send("You won");
      setTimeout(function() {
        gameObj.playerA.send("Click 'Home' to play another game!");
        gameObj.playerB.send("Click 'Home' to play another game!");
        gameObj.playerB.close();
        gameObj.playerA.close();
      }, 3000);
      
  
      gameStatus.gamesInitialized--;
      gameStatus.gamesCompleted++;
    }

    else if (message.includes("Move: ") && con == gameObj.playerA) {
      console.log("[LOG] " + message.substring(7) + " [CONNECTION]: " + con.id);
      var a = checkMove(message.substring(6), gameObj.arrB);
      if (a == 0) {
        gameObj.playerB.send("It's your turn");
        gameObj.playerA.send("It's B's turn");
      }

      if (a != 0) {
        gameObj.playerA.send("It's your turn");
        gameObj.playerB.send("It's A's turn");
        gameObj.playerA.send("HitA: " + a);
        gameObj.playerB.send("HitB: " + a);
      }
    }
    
    else if (message.includes("Move: ") && con == gameObj.playerB) {
      console.log("[LOG] " + message.substring(7) + " [CONNECTION]: " + con.id);
      var a = checkMove(message.substring(6), gameObj.arrA);
      if (a == 0) {
        gameObj.playerA.send("It's your turn");
        gameObj.playerB.send("It's A's turn");
      }

      if (a != 0) {
        gameObj.playerB.send("It's your turn");
        gameObj.playerA.send("It's A's turn");
        gameObj.playerB.send("HitA: " + a);
        gameObj.playerA.send("HitB: " + a);
      }

    }
    else if (message == "Hello from client") {
      console.log("[LOG] " + message + " " + (connectionID - 1));
    }


    else {
      if (con == gameObj.playerA) {
        var arrA = JSON.parse(message);
        gameObj.setArrayA(arrA);
      }

      if (con == gameObj.playerB) {
        var arrB = JSON.parse(message);
        gameObj.setArrayB(arrB);

      }
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
        gameObj.playerA.send("Your opponent has left the game");
        gameObj.playerA.close();
        gameObj.playerA == null;
      }

      catch (e) {
        console.log("Player A closing: " + e);
      }

      try {
        gameObj.playerA.send("Your opponent has left the game");
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

app.get('/', function (req, res) {
  res.render("splash.ejs", {totalVisits: gameStatus.totalVisits, gamesStarted: (gameStatus.gamesInitialized - 1) - gameStatus.gamesAborted, playersOnline: gameStatus.playersOnline, gamesCompleted: gameStatus.gamesCompleted });
});

//setup route /play which loads game.html
app.get("/play", function (req, res) {
 // console.log( req.cookies);
  
  
  res.sendFile("game.html", { root: "./public" }, cookie);
  
  

  var visits;
  visits = JSON.stringify(req.cookies).substring(11, 12);
  
  if(JSON.stringify(req.cookies).length == 15){
    visits = JSON.stringify(req.cookies).substring(11, 13);
  }
  

  visits++;
  gameStatus.totalVisits = visits;
  res.cookie("Visits", visits, {maxAge: 31536000});
  res.send
 
});


app.get("/*", function (req, res) {
  res.send("Not a valid route...");
});


