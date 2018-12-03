var main = function () {
    "use strict";
    //popup 
    $(".Rules").hide();
    $(".close").hide();

    $(".howTo").on("click", function (event) {
        $(".Rules").fadeIn();
        $(".close").fadeIn();
    });

    $(".close").on("click", function (event) {
        $(".Rules").fadeOut();
        $(".close").fadeOut();
    });
    
    //
    
   };
$(document).ready(main);
   