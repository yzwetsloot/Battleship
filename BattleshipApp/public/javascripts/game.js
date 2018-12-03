var main = function() {
    "use strict";

    var today = new Date();

    function printTime () {
        var today = new Date();
        var hours = today.getHours();
        var mins = today.getMinutes();
        var secs = today.getSeconds();
        document.getElementById('currentTime').innerHTML = " " + hours + ":" + mins + ":" + secs;
    }

    setInterval(printTime, 1000);

    $(function() {
        $(".boat").draggable();
    });
}

$(document).ready(main);