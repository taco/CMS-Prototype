(function ($, win, doc) {
    
    $(doc).ready(function () {

         setTimeout(function () {
            $('.mz-cms-grid').mzGrid();
            $('.mz-cms-widget').mzWidget();   
         }, 500);
    });
    
}(jQuery, window, document));


Template.widgets.events({
	'click .on': function() {
		$.mozu.editor.showDropZones();
	},

	'click .off': function() {
		$.mozu.editor.hideDropZones();
	}
})