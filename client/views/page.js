(function ($, win, doc) {
    
    $(doc).ready(function () {

         setTimeout(function () {
            $('.layout').mzGrid();
            $('.widget').mzWidget();   
         }, 500);
    });
    
}(jQuery, window, document));