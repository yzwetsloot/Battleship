var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT";
    this.arrA;
    this.arrB;
    this.setArrayA = function (arrA) {
        this.arrA = arrA;
    };
    this.setArrayB = function(arrB) {
        this.arrB = arrB;
    };
}

game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINT");
};

game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["A"] = 3; //A won
game.prototype.transitionStates["B"] = 4; //B won
game.prototype.transitionStates["ABORTED"] = 5;

game.prototype.setStatus = function (w) {
    console.assert(typeof w == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof w);
    this.gameState = w;
    console.log("[STATUS] %s", this.gameState);
};

game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINT");
};

game.prototype.addPlayer = function (p) {
    console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }
    if (this.playerA == null) {
        this.setStatus("1 JOINT");
        this.playerA = p;
        return "A";
    }
    else {
        this.playerB = p;
        this.setStatus("2 JOINT");
        return "B";
    }
};

module.exports = game;