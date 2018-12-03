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

    var clickCount = 0;
    //allow user to click on enemies field, change color limited amount
    $(".p2board .box").on("click", function (event) {
        
        console.log("Hello world!");
        clickCount++;
        console.log(clickCount);
    });
}

$(document).ready(main);