(function ($, win, doc) {
    
    $(doc).ready(function () {

         setTimeout(function () {
            $('.layout').mozuGrid();
            $('.widget').mozuWidget();   
         }, 500);
    });
    
}(jQuery, window, document));