var gameStatus = {
    since : Date.now(),     
    gamesInitialized : 0, 
    gamesAborted : 0,
    gamesCompleted : 0,
    playersOnline : 0,
    totalVisits : 0
};

module.exports = gameStatus;