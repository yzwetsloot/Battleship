var main = function () {
    "use strict";
    //popup 
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

    /*var clickSomewhere = function () {
            $(":not(.rules, .howTo)").on("click", function (event) {
            $(".rules").fadeOut();
            $(".close").fadeOut();
        });
    };
    setInterval(clickSomewhere, 3000);*/

    //
    
   };
$(document).ready(main);
   