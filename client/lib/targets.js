;
(function($, win, doc) {
    'use strict';

    var Target,
        Grid,
        Row,
        Col,
        Block;

    
    Grid = function(element, options) {
        this.options = $.extend({}, Grid.DEFAULTS, options);
        this.element = element;

        this.element
            .on({
                drop: function () { mzEditor.drop(); }
            })
            .droppable()
            .find('.grid')
                .mzRow({ grid: this });

        this.type('grid');

    }

    Grid.prototype.type = function(val) {
        if (val) {
            this._type = val;
            return this.element;
        }
        return this._type;
    }

    
    Target = function (element, options) {
        this.options = $.extend({}, Target.DEFAULTS, options);
        this.element = element;
    }

    Target.prototype.insert = function(quadrant, widgetCfg) {

    }

    Target.prototype.rebase = function() {

    }

    Target.prototype.remove = function() {

    }

    Target.prototype.offset = function() {

    }

    Target.prototype.hint = function() {

    }

    Target.prototype.quadrant = function() {

    }


    var Test = function () {
        this.data = 'my-data';
    }

    Test.prototype.read = function() {
        return this.data;
    }

    Test.prototype.set = function(val) {
        this.data = val;
    }

    $.mzClassFactory(Test, 'mozu.mzTest');


}(jQuery, window, document));