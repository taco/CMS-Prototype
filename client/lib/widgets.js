(function($, win, doc) {
    var $doc = $(doc),
        $tmp,
        cfg,
        editor;

    cfg = {
        rowHintMargin: 15,
        colHintMargin: 15,
        colHintRatio: 0.25
    };

    editor = {
        _dragging: false,

        init: function() {
            $tmp = $('<div class="tmp">').appendTo('body');

            this.$hintBar = $('<div class="hint-bar"><div class="hint-message"></div></div>').appendTo('body');

            $doc.on({
                mousemove: $.proxy(editor._onMousemove, editor)
            });
        },

        dragging: function(val) {
            if (typeof val !== 'undefined') this._dragging = val;
            return this._dragging;
        },

        startDrag: function() {
            $('.layout').addClass('droppable');
            this.dragging(true);
        },

        stopDrag: function() {
            $('.layout').removeClass('droppable');
            this.dragging(false);
            this.$hintBar.hide();
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
            if (this._hintElement === data.target && this._hintQuadrant === data.quadrant) return;

            this._hintElement = data.target
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

        },



        /**
         * Determines what quadrant the mouse is in
         * @return {string} 'top', 'right', 'bottom', or 'left'
         */
        quadrant: function(x, y, offset) {
            var xMax = offset.width,
                yMax = offset.height;

            x -= offset.left;
            y -= offset.top;


            if (yMax * x >= xMax * y) {
                // TOP or RIGHT
                return (xMax * y >= (xMax - x) * yMax) ? 'right' : 'top';
            } else {
                // BOTTOM or LEFT
                return (yMax * x >= (yMax - y) * xMax) ? 'bottom' : 'left';
            }
        }
    };



    $.widget('custom.mozuGrid', {
        options: {},
        _create: function() {
            this.rows = this.element.find('.grid').mozuRow({
                grid: this
            });

            this.element.on({
                mousemove: $.proxy(this._onMouseover, this)
            });

            this.element.droppable({
                over: $.proxy(this._onOver, this),
                out: $.proxy(this._onOut, this),
                drop: $.proxy(this._onDrop, this)
            });
        },

        _onOver: function(event, ui) {

        },

        _onOut: function(event, ui) {

        },

        _onDrop: function(event, ui) {
            editor.stopDrag();
        },

        _onMouseover: function(e, ui) {

        }
    });

    $.widget('custom.mozuRow', {
        options: {
            grid: null
        },
        _create: function() {
            
            this.cols = this.element.find('[class*="col-"]').mozuCol({
                row: this
            });
        },

        offset: function () {
            if (!this._offset) {
                this._offset = this.element.offset();
                this._offset.width = this.element.width();
                this._offset.height = this.element.height();
                this._offset.target = this.element;
            }
            return this._offset;
        },
        initHint: function() {
            this._offset = null;
        },
        hint: function(x, y) {

            this.offset().message = 'row';
            //this.offset().quadrant = (y <= 10) ? 'top' : (y >= this.offset().height - 10) ? 'bottom' : null;
            this.offset().quadrant = this.quadrant(x, y);
            

            return this.offset();
        },
        quadrant: function (x, y) {
            var quadrant = editor.quadrant(x, y, this.offset());

            x -= this.offset().left;
            y -= this.offset().top;

            if ((quadrant === 'top' || quadrant === 'bottom')
                    && (y <= cfg.rowHintMargin || y >= this.offset().height - cfg.rowHintMargin)) {
                return quadrant;
            }
            return null;
        }
    });

    $.widget('custom.mozuCol', {
        options: {
            row: null
        },
        _create: function() {
            this.blocks = this.element.find('.block').mozuBlock({
                col: this
            });

            this.element.droppable({
                over: $.proxy(this._onOver, this),
                out: $.proxy(this._onOut, this),
                drop: $.proxy(this._onDrop, this)
            });

            this.row = this.options.row;
        },

        _onOver: function(event, ui) {

        },

        _onOut: function(event, ui) {
            editor.clearTarget(this);
            this._offset = null;
        },

        _onDrop: function(event, ui) {

        },

        _onMouseover: function(e, ui) {

        },
        initHint: function() {
            //editor.target(this);

            this.row.initHint();

            this._offset = null;
        },

        offset: function () {
            if (!this._offset) {
                this._offset = this.element.offset();
                this._offset.width = this.element.width();
                this._offset.height = this.element.height();
                this._offset.target = this.element;
            }
            return this._offset;
        },

        hint: function(x, y) {
            var rowOffset = this.row.hint(x, y);

            //  Prioritize ROW hinting over COL hinting
            if (rowOffset.quadrant) return rowOffset;

            this.offset().quadrant = this.quadrant(x, y);

            this.offset().message = (this.offset().quadrant === 'left' || this.offset().quadrant === 'right') ? 'column' : 'insert';

            return this.offset();
        },

        quadrant: function (x, y) {
            var quadrant = editor.quadrant(x, y, this.offset()),
                ratio = Math.round(this.offset().width * cfg.colHintRatio),
                margin = ratio > cfg.colHintMargin ? ratio : cfg.colHintMargin;

            x -= this.offset().left;
            y -= this.offset().top;

            // Columns can only be inserted on left or right
            if ((quadrant === 'left' || quadrant === 'right')
                    && (x <= margin || x >= this.offset().width - margin)) {
                return quadrant;
            }

            return null;
        }
    });

    $.widget('custom.mozuBlock', {
        options: {
            col: null
        },

        _create: function() {
            this.col = this.options.col;

            this.element.find('.content.html').attr('contenteditable', 'true');

            this.element.on({
                mouseenter: function() {

                }
            });

            this.element.droppable({
                over: $.proxy(this._onOver, this),
                out: $.proxy(this._onOut, this)
            });
        },

        _onOver: function (e, ui) {
            this.initHint();
        },

        _onOut: function (e, ui) {

        },

        offset: function () {
            if (!this._offset) {
                this._offset = this.element.offset();
                this._offset.width = this.element.width();
                this._offset.height = this.element.height();
                this._offset.target = this.element;
            }
            return this._offset;
        },

        initHint: function () {
            editor.target(this);
            this._offset = null;
            this.col.initHint();
        },

        hint: function(x, y) {
            var colOffset = this.col.hint(x, y);

            //  Prioritize COL hinting over BLOCK hinting
            if (colOffset.quadrant) return colOffset;

            /* //   Code for FLOAT insertion
                this.offset().quadrant = editor.quadrant(x, y, this.offset());

                this.offset().message = (this.offset().quadrant === 'top' || this.offset().quadrant === 'bottom')
                                        ? 'insert'
                                        : 'float';
            */
           

            this.offset().message = 'insert';
            y -= this.offset().top;

            //console.log('x', x, 'height/2', Math.round(this.offset().height/2));

            this.offset().quadrant = (y <= this.offset().height / 2) ? 'top' : 'bottom';

            return this.offset();
        }
    });

    $.widget('custom.mozuWidget', {
        options: {
            value: 0
        },
        _create: function() {
            this.element
                .addClass('draggable')
                .draggable({
                    cursor: 'move',
                    distance: 20,
                    cursorAt: {
                        top: 15,
                        left: 15
                    },
                    helper: function() {
                        return $('<div class="dd-helper"></div>');
                    },
                    start: $.proxy(editor.startDrag, editor),
                    stop: $.proxy(editor.stopDrag, editor),
                    drop: $.proxy(editor.stopDrag, editor)
                });
        }
    });

    $doc.ready(function() {
        editor.init();
    });



}(jQuery, window, document));