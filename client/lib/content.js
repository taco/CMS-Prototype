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
        this.element = $(element);

        this.element.addClass('default');

        this.$content = this.element.find('.content');
    }

    Content.DEFAULTS = {};

    /**
     * Binds the appropriate EVENT map, will change the state
     * based on the previous state
     * @param  {object} map Event map
     */
    Content.prototype.on = function(map) {
        var me = this;

        $.each(map, function(event, states) {
            var stateSplit = states.split('>'),
                from = stateSplit[0].trim(),
                to = stateSplit[1].trim(),
                eventSplit = event.split(' '),
                eventName = eventSplit[0],
                selector = eventSplit[1];



            me.element.on(event, selector, function() {
                if (me.state() === from) me.state(to);
            })
        });
    }

    Content.prototype.state = function(state) {
        return (state) ? this._setState(state) : this._getState();
    }

    Content.prototype._getState = function() {
        var state;

        if (this._state) state = this._state;
        else if (this.element.hasClass('default')) state = 'default';
        else if (this.element.hasClass('moving')) state = 'moving';
        else if (this.element.hasClass('editing')) state = 'editing';

        this._state = state;

        return state;
    }

    Content.prototype._setState = function(state) {
        this.element.removeClass('default moving editing');

        if (this['_' + state + 'State']) this['_' + state + 'State']();

        this.element.addClass(state);
        this._state = state;
    }


    /**
     * TEXT class definition
     */
    Text = function(element, options) {
        Content.call(this, element, options);

        this.on({
            'click': 'default > editing',
            'blur .content': 'editing > default'
        });
    }

    Text.prototype = new Content();
   
    Text.prototype._defaultState = function() {
        this.$content.removeAttr('contenteditable');
        console.log('default');
    }

    Text.prototype._editingState = function() {
        this.$content.attr('contenteditable', 'true');
        this.$content.focus();
        console.log('editing');
    }

    Text.prototype._movingState = function() {

    }


    /**
     * IMG class definition
     */
    Img = function(element, options) {
        Content.call(this, element, options);

        this.on({
            'dblclick': 'default > editing',
            'blur': 'editing > default'
        });
    }

    Img.prototype = new Content();
   
    Img.prototype._defaultState = function() {
        //this.$content.removeAttr('contenteditable');
        console.log('default');
    }

    Img.prototype._editingState = function() {
        //his.$content.attr('contenteditable', 'true');
        this.element.focus();
        console.log('editing');
    }

    Img.prototype._movingState = function() {

    }


    //  Plugin definitions
    $.mozu.classFactory(Text, 'mozu.mzText');
    $.mozu.classFactory(Img, 'mozu.mzImg');
    $.mozu.classFactory(Content, 'mozu.mzContent');

}(jQuery, window, document));