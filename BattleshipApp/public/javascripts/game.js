var main = function() {
    "use strict";

    var today = new Date();
    document.getElementById('hour').innerHTML=today.getHours();
    document.getElementById('minute').innerHTML=today.getMinutes();
}

$(document).ready(main);