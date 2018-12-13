var main = function () {
    "use strict";

    $(".rules").hide();
    $(".close").hide();

    $(".howTo").on("click", function (event) {
        $(".rules").fadeIn();
        $(".close").fadeIn();
    });

    $(".close").on("click", function (event) {
        $(".rules").fadeOut();
        $(".close").fadeOut();
    });

};
$(document).ready(main);
   