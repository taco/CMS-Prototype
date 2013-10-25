

Router.configure({
  layout: 'layout'
});

Router.map(function() { 
  this.route('page', {path: '/'});
  this.route('page');
});


$(document).ready(function () {



    //$('.widget'));

    //$('.widget').mozuWidget();

     //$('.layout').mozuGrid();
});


doIt = function() {
    $('.widget').mzWidget();
    $('iframe')[0].contentWindow.$('.layout').mzGrid();
}