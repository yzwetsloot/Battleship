var main = function() {
   "use strict";

   $(".cover").hide();

    function printTime () {
        var today = new Date();
        var hours = today.getHours();
        var mins = today.getMinutes();
        var secs = today.getSeconds();
        document.getElementById('currentTime').innerHTML = " " + hours + ":" + mins + ":" + secs;
    }

    setInterval(printTime, 1000);
    
    var seconds = 10;

    function countDown () {
        document.getElementById('status').innerHTML = "Set boats " + "(" + seconds + ")";
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

        var test = function timeout(){
          $(".boat").draggable({disabled: true});
          $(".boat2").draggable({disabled: true});
          $(".boat3").draggable({disabled: true});
        };

        $(function timeout_init(){
            setTimeout(test, 10000);
        });

        seconds--;
    }

    
    
    //ensure boat draggable
    // $(function() {
    //     $(".boat").draggable({ grid: [ 46, 46 ] }, {obstacle: ".boat", obstacle: ".boat2", obstacle: ".boat3",
    //     preventCollision: true, containment: "parent"});
    // });

    // $(function() {
    //     $(".boat2").draggable({ grid: [ 46, 46 ] }, {obstacle: ".boat", obstacle: ".boat2", obstacle: ".boat3",
    //     preventCollision: true, containment: "parent"});
    // });

    // $(function() {
    //     $(".boat3").draggable({ grid: [ 46, 46 ] }, {obstacle: ".boat", obstacle: ".boat2", obstacle: ".boat3",
    //     preventCollision: true, containment: "parent"});
    // });

    //implementing webSockets
    var socket = new WebSocket("ws://" + window.location.hostname + ":3000");
    socket.onopen = function(){
        socket.send("Hello from client");
        document.getElementById("status").innerHTML = "Sending a first message to the server ...";
    };


    socket.onmessage = function(event){
        document.getElementById("status").innerHTML = event.data;
        if (event.data == "Game started") {
            var x = setInterval(function () { 
                if (seconds >= 0) {
                    countDown();
                }
                else {
                    document.getElementById("status").innerHTML = "Game will now start";
                    socket.send("Client ready");
                    clearInterval(x);
                }

            },1000);
            
        }

        if (event.data == "It's your turn") {
            $(".cover").hide();
            $(document).one("click", function (event) { 
                $(event.target).css('background-color', '#69f0ae');
                $(".cover").show();
                let move = "Move: " + $(event.target).attr('id');
                socket.send(move); 
            })
        }
    };
};

$(document).ready(main);
