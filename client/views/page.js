(function ($, win, doc) {
    
    $(doc).ready(function () {

         setTimeout(function () {
            $('.mz-cms-grid').mzGrid();
            $('.mz-cms-widget').mzWidget();   
         }, 500);
    });
    
}(jQuery, window, document));