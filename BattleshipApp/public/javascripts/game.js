var main = function() {
   "use strict";

   $(".cover").hide();
   var overlappingSquares = {};
   var coordinates = [$("#A,1"), $("#A,2"), $("#A,3"), $("#A,4"), $("#A,5"), $("#A,6"), $("#A,7"), $("#A,8"), $("#A,9"), $("#A,10")];

   var pushOverlap = function (arr1, el) {
       var a = 0;
       for (var i = 0; i < arr1.length; i++) {
           if (overlap(arr1[i], el)) {
               overlappingSquares[a] = arr1[i];
               a++;
           }
       }
   }

   
    var overlap = function (rect1, rect2) {
        return !(rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom);
    }

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

          var pABoats = {};
          var pBBoats = {};  
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
                    pushOverlap(coordinates, $(".small1"));
                    console.log(overlappingSquares[0]);
                    document.getElementById("status").innerHTML = "Game will now start";
                    socket.send("Client ready");
                    clearInterval(x);
                }

            },1000);
            
        }

        if (event.data == "It's your turn") {
            $(".cover").hide();
            $(".p2board").one("click", function clickbox(event) { 
                var id = event.target.id;

                $(event.target).css('background-color', '#69f0ae');
                $(".cover").show();
                socket.send("Move: " + id);
            })
        }
    };
};

$(document).ready(main);
