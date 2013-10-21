(function ($, win, doc) {
    
    
    $(doc).ready(function () {



        //$('.widget'));

        // $('.widget').mozuWidget();

         $('.layout').mozuGrid();
         console.log('MOZUGRID', $('.layout'), typeof $('.layout').mozuGrid);
         

         setTimeout(function () {
            $('.layout').mozuGrid();
            $('.widget').mozuWidget();   
         }, 500);
    });


    

    

}(jQuery, window, document));