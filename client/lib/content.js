;
(function($, win, doc) {
    'use strict';

    var Content,
        Text,
        Img;

    /**
     * CONTENT Class Definition
     */
    Content = function(element, options) {
        this.options = $.extend({}, Content.DEFAULTS, options);
        this.element = element;
        this._changeState();
    }

    Content.DEFAULTS = {};

    Content.prototype.state = function(state) {
        return (state) ? this._setState(state) : this.getState();
    }

    Content.prototype._getState = function() {
        if (this.element.hasClass('default')) return 'default';
        if (this.element.hasClass('moving')) return 'moving';
        if (this.element.hasClass('editing')) return 'editing';
    }

    Content.prototype._setState = function(state) {
        this.element.removeClass('default moving editing');

        this._changeState(state);

        this.element.addClass(state);
        return state;
    }

    Content.prototype._changeState = function(state) {

    }


    /**
     * TEXT class definition
     */
    Text = function(element, options) {
        Content.call(this, element, options);
    }

    Text.prototype = new Content();

    Text.prototype._changeState = function(state) {

    }


    /**
     * IMG class definition
     */
    Img = function(element, options) {
        Content.call(this, element, options);
    }

    Img.prototype = new Content();

    Img.prototype._changeState = function(state) {

    }

    //  Plugin definitions
    $.mozu.classFactory(Text, 'mozu.mzText');
    $.mozu.classFactory(Img, 'mozu.mzImg');
    $.mozu.classFactory(Content, 'mozu.mzContent');

}(jQuery, window, document));