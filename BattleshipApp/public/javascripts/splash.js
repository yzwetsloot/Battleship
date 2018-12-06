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

    //maybe implement it so that clicking anywhere except howToPlay message makes it dissappear
    
};
$(document).ready(main);
   