(function ($, win, doc) {
    
    
    $(doc).ready(function () {



        //$('.widget'));

        // $('.widget').mozuWidget();

         $('.layout').mozuGrid();
         console.log('MOZUGRID', $('.layout'), typeof $('.layout').mozuGrid);
    });


    

    

}(jQuery, window, document));