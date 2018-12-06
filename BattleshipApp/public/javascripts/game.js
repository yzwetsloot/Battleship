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
}

$(document).ready(main);