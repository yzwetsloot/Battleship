var main = function() {
   "use strict";

   $(".cover").hide();
   
    var overlap = function (rect1, rect2) {
        return !(rect1.right-5 < rect2.left || 
            rect1.left > rect2.right-5 || 
            rect1.bottom-5 < rect2.top || 
            rect1.top > rect2.bottom-5);
    }
   var overlappingSquares = [];
   var coordinates = ["A,1", "A,2", "A,3", "A,4", "A,5", "A,6", "A,7", "A,8", "A,9", "A,10",
    "B,1", "B,2", "B,3", "B,4", "B,5", "B,6", "B,7", "B,8", "B,9", "B,10",
    "C,1", "C,2", "C,3", "C,4", "C,5", "C,6", "C,7", "C,8", "C,9", "C,10",
    "D,1", "D,2", "D,3", "D,4", "D,5", "D,6", "D,7", "D,8", "D,9", "D,10",
    "E,1", "E,2", "E,3", "E,4", "E,5", "E,6", "E,7", "E,8", "E,9", "E,10",
    "F,1", "F,2", "F,3", "F,4", "F,5", "F,6", "F,7", "F,8", "F,9", "F,10",
    "G,1", "G,2", "G,3", "G,4", "G,5", "G,6", "G,7", "G,8", "G,9", "G,10",
    "H,1", "H,2", "H,3", "H,4", "H,5", "H,6", "H,7", "H,8", "H,9", "H,10",
    "I,1", "I,2", "I,3", "I,4", "I,5", "I,6", "I,7", "I,8", "I,9", "I,10",
    "J,1", "J,2", "J,3", "J,4", "J,5", "J,6", "J,7", "J,8", "J,9", "J,10"];

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

        var timeout = function timeout(){
          $(".boat").draggable({disabled: true});
          $(".boat2").draggable({disabled: true});
          $(".boat3").draggable({disabled: true});

        };

        $(function timeout_init(){
            setTimeout(timeout, 10000);
        });

        seconds--;
    }

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
                    
                    var overlappingBoats = function (boat, arr){
                        for(var i = 0; i < 100; i++){
                          if(overlap(document.getElementById(boat).getBoundingClientRect(), document.getElementById(arr[i]).getBoundingClientRect())){
                              overlappingSquares.push(arr[i]);
                          }
                        }
                    }
          
                    overlappingBoats("small1", coordinates);
                    overlappingBoats("small2", coordinates);
                    overlappingBoats("small3", coordinates);
                    overlappingBoats("small4", coordinates);
          
                    overlappingBoats("med1", coordinates);
                    overlappingBoats("med2", coordinates);
                    overlappingBoats("med3", coordinates);
          
                    overlappingBoats("large1", coordinates);
                    overlappingBoats("large2", coordinates);
          
                    for(var i = 0; i < overlappingSquares.length; i++){
                        console.log(overlappingSquares[i])
                    }
        
                    
        //            setTimeout(timeout, 5000)
                    document.getElementById("status").innerHTML = "Game will now start";
                    socket.send("Client ready");
                    clearInterval(x);
                }

            },1000);
            
        }

        if (event.data == "It's your turn") {
            $(".cover").hide();
            $(".p2board").one("click", function(event) { 
                var id = event.target.id;

                $(event.target).css('background-color', '#69f0ae');
                $(".cover").show();
                socket.send("Move: " + id);
            })
        }
    };
};

$(document).ready(main);
