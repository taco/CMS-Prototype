;
(function($, win, doc) {
    'use strict';

    var Content,
        oldContent,
        Text,
        oldText,
        Img,
        oldImg;

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
        console.log('_changeState Content')
    }

    

    /**
     * CONTENT plugin definition
     */
    oldContent = $.fn.mzContent;

    $.fn.mzContent = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('mozu.mzContent'),
                options = typeof option === 'object' && option;

            if (!data) $this.data('mozu.mzContent', (data = new Content(this, options)));
            if (typeof option === 'string') data[option]();
        });
    }

    $.fn.mzContent.noConflict = function () {
        $.fn.mzContent = oldContent;
        return this;
    }


    /**
     * TEXT class definition
     */
    Text = function(element, options) {
        Content.call(this, element, options);
    }

    Text.prototype = new Content();

    Text.prototype._changeState = function(state) {
        console.log('_changeState Text');
    }

    /**
     * TEXT plugin definition
     */
    oldText = $.fn.mzText;

    $.fn.mzText = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('mozu.mzText'),
                options = typeof option === 'object' && option;

            if (!data) $this.data('mozu.mzText', (data = new Text(this, options)));
            if (typeof option === 'string') data[option]();
        });
    }

    $.fn.mzText.noConflict = function () {
        $.fn.mzText = oldText;
        return this;
    }


    /**
     * IMG class definition
     */
    Img = function (element, options) {
        Content.call(this, element, options);
    }

    Img.prototype = new Content();

    Img.prototype._changeState = function(state) {
        console.log('_changeState Img');
    }

    /**
     * IMG plugin definition
     */
    oldImg = $.fn.mzImg;

    $.fn.mzImg = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('mozu.mzImg'),
                options = typeof option === 'object' && option;

            if (!data) $this.data('mozu.mzImg', (data = new Img(this, options)));
            if (typeof option === 'string') data[option]();
        });
    }

    $.fn.mzImg.noConflict = function () {
        $.fn.mzImg = oldImg;
        return this;
    }

}(jQuery, window, document));