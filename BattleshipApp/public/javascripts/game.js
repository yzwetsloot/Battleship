var main = function() {
    "use strict";
    //display current date
    var today = new Date();

    function printTime () {
        var today = new Date();
        var hours = today.getHours();
        var mins = today.getMinutes();
        var secs = today.getSeconds();
        document.getElementById('currentTime').innerHTML = " " + hours + ":" + mins + ":" + secs;
    }

    setInterval(printTime, 1000);
    
    //ensure boat draggable
    $(function() {
        $(".boat").draggable();
    });

    //implementing webSockets
    var socket = new WebSocket("ws://localhost:3000");
    socket.onmessage = function(event){
        document.getElementById("status").innerHTML = event.data;
    }

    socket.onopen = function(){
        socket.send("Hello from the client!");
        document.getElementById("status").innerHTML = "Sending a first message to the server ...";
    };
}

$(document).ready(main);