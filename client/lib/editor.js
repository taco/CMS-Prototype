;
(function($, win, doc) {
    'use strict';

    var $doc = $(doc);

    if (!$.mozu) $.mozu = {};

    $.mozu.editor = {
        _dragging: false,

        init: function() {

            this.$hintBar = $('<div class="hint-bar"><div class="hint-message"></div></div>').appendTo('body');

            $doc.on({
                mousemove: $.proxy($.mozu.editor._onMousemove, $.mozu.editor)
            });
        },

        dragging: function(val) {
            if (typeof val !== 'undefined') this._dragging = val;
            return this._dragging;
        },

        startDrag: function(widgetCfg) {
            //debugger;
            if (widgetCfg && widgetCfg.type && widgetCfg.type() === 'block') {
                widgetCfg = {
                    block: widgetCfg
                };
            }
            this.widgetCfg = widgetCfg || {};
            $('.layout').addClass('droppable');
            this.dragging(true);
        },

        stopDrag: function() {
            $('.layout').removeClass('droppable');
            this.dragging(false);
            this.$hintBar.css({
                display: 'none',
                left: -1000,
                top: -1000
            });
        },

        target: function(target) {
            if (!target.hint) return;
            this._target = target;
        },

        clearTarget: function(target) {
            // Only clear if a new target has NOT been set up yet
            if (this._target !== target) return;

            this._target = null;
        },

        drop: function() {
            var target = this._hintTarget,
                quadrant = this._hintQuadrant;

            this.stopDrag();

            // Make sure there is a target and a quadrant
            if (target && quadrant && target.insert) {
                target.insert(quadrant, this.widgetCfg);    
            }

            this._hintQuadrant = null;
            this._hintTarget = null;

            
        },

        _onMousemove: function(e, ui) {
            var x,
                y,
                data;

            // On track when tragging
            if (!this.dragging()) return;

            //  Only fire if tracking a target
            if (!this._target) return;

            x = $doc.scrollLeft() + e.clientX;
            y = $doc.scrollTop() + e.clientY;

            data = this._target.hint(x, y);

            this.hint(data)
        },

        hint: function(data) {
            var height = 3,
                width = 3,
                x = data.left - 1,
                y = data.top - 1;

            // If showing the same hint in the same location, abort hinting
            if (this._hintTarget === data.target && this._hintQuadrant === data.quadrant) return;

            this._hintTarget = data.target;
            this._hintQuadrant = data.quadrant;

            switch (data.quadrant) {
                case 'top':
                    width = data.width + 1;
                    break;

                case 'right':
                    height = data.height + 2;
                    x += data.width;
                    break;

                case 'bottom':
                    width = data.width + 1;
                    y += data.height;
                    break;

                case 'left':
                    height = data.height + 2;
                    break;
            }

            this.$hintBar.css({
                left: x,
                top: y,
                height: height,
                width: width,
                display: 'block'
            }).find('.hint-message').html(data.message);

        }
    };

    $doc.ready(function() {
        $.mozu.editor.init();
    });

}(jQuery, window, document));
