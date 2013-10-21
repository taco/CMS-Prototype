(function ($, win, doc) {
    var $doc = $(doc),
        $tmp,
        editor;

    editor = {
        init: function () {
            $tmp = $('<div class="tmp">').appendTo('body');
            this.$hintBar = $('<div class="hint-bar"><div class="hint-message"></div></div>').appendTo('body');
            $doc.on({
                mousemove: $.proxy(editor._onMousemove, editor)
            });
        },
        _dragging: false,
        dragging: function (val) {
            if (typeof val !== 'undefined') this._dragging = val;
            return this._dragging;
        },
        startDrag: function () {
            $('.layout').addClass('droppable');
            this.dragging(true);
            console.log('start drag');
        },
        stopDrag: function () {
            $('.layout').removeClass('droppable');
            this.dragging(false);
            console.log('stop drag');
        },
        target: function (target) {
            if (!target.hint) return;
            this._target = target;
        },
        clearTarget: function (target) {
            
            // Only clear if a new target has NOT been set up yet
            if (this._target !== target) return;

            this._target = null;
        },
        _onMousemove: function (e, ui) {
            var x,
                y,
                data;

            // On track when tragging
            if (!this.dragging) return;

            //  Only fire if tracking a target
            if (!this._target) return;

            x = $doc.scrollLeft() + e.clientX;
            y = $doc.scrollTop() + e.clientY;

            //this._target.onMousemove(x, y);
            data = this._target.hint(x, y);

            this.hint(data)
        },

        hint: function (data) {
            var height = 3,
                width = 3,
                x = data.left,
                y = data.top;

            // If showing the same hint in the same location, abort hinting
            if (this._hintElement === data.target && this._hintQuadrant === data.quadrant) return;

            //if (data.row) this._hintElement = data;row

            this._hintElement = data.target
            this._hintQuadrant = data.quadrant;

            switch (data.quadrant) {
                case 'top':
                    width = data.width;
                    break;

                case 'right':
                    height = data.height;
                    x += data.width - 2;
                    break;

                case 'bottom':
                    width = data.width;
                    y += data.height - 2;
                    break;

                case 'left':
                    height = data.height;
                    break;
            }

            this.$hintBar.css({
                left: x,
                top: y,
                height: height,
                width: width
            }).find('.hint-message').html(data.message);

        }
    };


    
    $.widget('custom.mozuGrid', {
        options: {},
        _create: function () {
            var me = this;
            //debugger;

            console.log('init grid');

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

         _onOver: function (event, ui) {

         },

         _onOut: function (event, ui) {

         },

         _onDrop: function (event, ui) {

         },

         _onMouseover: function (e, ui) {
            
         }
    });

    $.widget('custom.mozuRow', {
        options: {
            grid: null
        },
        _create: function () {
            console.log('init row');
            this.cols = this.element.find('[class*="col-"]').mozuCol({
                row: this
            });
        },
        initHint: function () {
            this.offset = this.element.offset();
            this.offset.width = this.element.width();
            this.offset.height = this.element.height();
            this.offset.target = this.element;
        },
        hint: function (x, y) {
            x -= this.offset.left;
            y -= this.offset.top;


            this.offset.message = 'row';
            this.offset.quadrant = (y <= 10)
                                    ? 'top'
                                    : (y >= this.offset.height - 10)
                                        ? 'bottom'
                                        : null;
            return this.offset;
        }
    });

    $.widget('custom.mozuCol', {
        options: {
            row: null
        },
        _create: function () {
            console.log('init col');
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

         _onOver: function (event, ui) {
            editor.target(this);

            this.row.initHint();

            this.offset = this.element.offset();
            this.offset.width = this.element.width();
            this.offset.height = this.element.height();
            this.offset.target = this.element;

            console.log('over col');
         },

         _onOut: function (event, ui) {
            editor.clearTarget(this);
            this.offset = null;
            console.log('out col');
         },

         _onDrop: function (event, ui) {

         },

         _onMouseover: function (e, ui) {
            
         },

         hint: function (x, y) {
            var rowOffset = this.row.hint(x, y);

            //  Prioritize ROW hinting over COL hinting
            if (rowOffset.quadrant) return rowOffset;

            this.offset.quadrant = this._getQuadrant(x, y);

            this.offset.message = (this.offset.quadrant === 'left' || this.offset.quadrant === 'right')
                                    ? 'column'
                                    : 'insert';

            return this.offset;
         },

         // onMousemove: function (x, y) {
         //    var quadrant = this._getQuadrant(x, y);

         //    $tmp.css({
         //        left: this.offset.left,
         //        top: this.offset.top
         //    }).html(quadrant + ' (' + x + ', ' + y + ')');
         // },

         /**
          * Determines what quadrant the mouse is in
          * @return {string} 'top', 'right', 'bottom', or 'left'
          */
         _getQuadrant: function (x, y) {
            var xMax = this.offset.width,
                yMax = this.offset.height;

            x -= this.offset.left;
            y -= this.offset.top;

            
            if (yMax * x >= xMax * y) {
                // TOP or RIGHT
                return (xMax * y >= (xMax - x) * yMax)
                        ? 'right'
                        : 'top';
            } else {
                // BOTTOM or LEFT
                return (yMax * x >= (yMax - y) * xMax)
                        ? 'bottom'
                        : 'left';
            }
         }
    });

    $.widget('custom.mozuBlock', {
        options: {
            col: null
        },
        _create: function () {
            console.log('init block');

            this.element.find('.content.html').attr('contenteditable', 'true');

            this.element.on({
                mouseenter: function () {
                    console.log('mouseenter');
                }
            })
        }
    });

    $.widget('custom.mozuWidget', {
        options: {
            value: 0
        },
        _create: function () {
            this.element
                .addClass('draggable')
                .draggable({
                    cursor: 'move',
                    distance: 20,
                    cursorAt: {
                        top: 15,
                        left: 15
                    },
                    helper: function () {
                        return $('<div class="dd-helper"></div>');
                    },
                    start: $.proxy(editor.startDrag, editor),
                    stop: $.proxy(editor.stopDrag, editor),
                    drop: $.proxy(editor.stopDrag, editor)
                });
        },
        print: function () {
            console.log(this.random);
        }
    });

    $doc.ready(function () {
        editor.init();
    });

    

}(jQuery, window, document));