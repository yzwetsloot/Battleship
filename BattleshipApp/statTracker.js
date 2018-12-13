var gameStatus = {
    since : Date.now(),     /* since we keep it simple and in-memory, keep track of when this object was created */
    gamesInitialized : 0,   /* number of games initialized */
    gamesAborted : 0,       /* number of games aborted */
    gamesCompleted : 0,      /* number of games successfully completed */   
    playersOnline : 0,
    totalVisits : 0
};

module.exports = gameStatus;