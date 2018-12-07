(function(exports){

    // Client to server: winner is...
    exports.T_GAME_WON_BY = "GAME-WON-BY";             
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null
    };

     
    // Server to Player A or B: send win status to player              
    exports.O_GAME_WON =  {
        type: "GAME-WON"};
    exports.S_GAME_WON = JSON.stringify(exports.O_GAME_WON);
    
    // Server to Player A or B: send lose status to player
    exports.O_GAME_LOST =  {
        type: "GAME-LOST"};
    exports.S_GAME_LOST = JSON.stringify(exports.O_GAME_LOST);

    //Server to client: abort game (e.g. if second player exited the game) 
    exports.O_GAME_ABORTED = {                          
        type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);


    //Server to client: waitig for second player
    exports.O_WAITING_FOR_PLAYER = {
        type: "WAITING-FOR-PLAYER"
    }
    exports.S_WAITING_FOR_PLAYER = JSON.stringify(exports.O_WAITING_FOR_PLAYER);
 
    //Server to client: Your turn
    exports.O.YOUR_TURN = {
        type: "YOUR-TURN"
    }
    exports.S_YOUR_TURN = JSON.stringify(exports.O_YOUR_TURN);


    //Server to client: aet player A
    exports.O_PLAYER_A = {                            
        type: exports.T_PLAYER_TYPE,
        data: "A"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);


    //Server to client: Set player B
    exports.O_PLAYER_B = {                            
        type: exports.T_PLAYER_TYPE,
        data: "B"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    //Client to server: Boat position
    exports.T_BOAT_POSITION = "BOAT-POSITION";         
    exports.O_BOAT_POSITION = {
        type: exports.T_BOAT_POSITION,
        data: null
    };

    //Client to server: Shows if a boat is broken
    exports.T_BOAT_BROKEN = "aBOAT-BROKEN";
    exports.O_BOAT_BROKEN = {
        type: exports.T_BOAT_BROKEN,
        data: null
    }



    

})