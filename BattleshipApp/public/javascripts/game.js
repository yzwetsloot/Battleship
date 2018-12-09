var main = function() {
   "use strict";
    //display current date
    var today = new Date();

    $(".ready").hide();

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
        $(".boat").draggable({ grid: [ 46, 46 ] }, {obstacle: ".boat", obstacle: ".boat2", obstacle: ".boat3",
        preventCollision: true, containment: "parent"});
    });

    $(function() {
        $(".boat2").draggable({ grid: [ 46, 46 ] }, {obstacle: ".boat", obstacle: ".boat2", obstacle: ".boat3",
        preventCollision: true, containment: "parent"});
    });

    $(function() {
        $(".boat3").draggable({ grid: [ 46, 46 ] }, {obstacle: ".boat", obstacle: ".boat2", obstacle: ".boat3",
        preventCollision: true, containment: "parent"});
    });

    //implementing webSockets
    var socket = new WebSocket("ws://" + window.location.hostname + ":3000");
    socket.onopen = function(){
        socket.send("Hello from client");
        document.getElementById("status").innerHTML = "Sending a first message to the server ...";
    };


    socket.onmessage = function(event){
        document.getElementById("status").innerHTML = event.data;
        if (event.data == "Game started") {
            setTimeout(function() {document.getElementById("status").innerHTML = "Set boats";}, 1000);
            $(".ready").show();

            $(".ready").on("click", function (event) {
                socket.send("Ready from client");
                $(".ready").fadeOut();
                document.getElementById("status").innerHTML = "Waiting for opponent to set boats...";
            });
            
        }
    };
};

$(document).ready(main);
