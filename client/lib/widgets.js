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

        drop: function() {
            var target = this._hintTarget,
                quadrant = this._hintQuadrant;

            // Make sure there is a target and a quadrant
            if (!target || !quadrant || !target.insert) return;

            target.insert(quadrant);
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
        },


        createBlock: function(widgetCfg) {
            var $block = $('<div class="block"><div class="content"></div></div>');

            // Insert widget content (for now, just doing text)
            $block.find('.content').addClass('html').html('<h1>Insert</h1><p>Click here to edit</p>');

            return $block.mozuBlock().data('mozuBlock');
        },

        createCol: function(widgetCfg) {
            var $col = $('<div class="col-12-12 dropped-col"></div>'),
                block = (widgetCfg && widgetCfg.block) ? widgetCfg.block : this.createBlock(widgetCfg),
                col;

            $col.append(block.element);

            col = $col.mozuCol().data('mozuCol');

            block.col = col;

            return col;
        },

        createRow: function(widgetCfg) {
            var $row = $('<div class="grid grid-pad"></div>'),
                col = this.createCol(widgetCfg),
                row;

            $row.append(col.element);

            row = $row.mozuRow().data('mozuRow');

            col.row = row;

            return row;
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

            this.isGrid = true;
        },

        _onOver: function(event, ui) {

        },

        _onOut: function(event, ui) {

        },

        _onDrop: function(event, ui) {
            editor.drop();
        },

        _onMouseover: function(e, ui) {

        },
    });

    $.widget('custom.mozuRow', {
        options: {
            grid: null
        },

        _create: function() {

            this.cols = this.element.find('[class*="col-"]').mozuCol({
                row: this
            });

            this.isRow = true;
        },

        offset: function() {
            if (!this._offset) {
                this._offset = this.element.offset();
                this._offset.width = this.element.width();
                this._offset.height = this.element.height();
                this._offset.target = this;
            }
            return this._offset;
        },

        initHint: function() {
            this._offset = null;
        },

        hint: function(x, y) {
            this.offset().message = 'row';
            this.offset().quadrant = this.quadrant(x, y);

            return this.offset();
        },

        quadrant: function(x, y) {
            var quadrant = editor.quadrant(x, y, this.offset());

            x -= this.offset().left;
            y -= this.offset().top;

            if ((quadrant === 'top' || quadrant === 'bottom') && (y <= cfg.rowHintMargin || y >= this.offset().height - cfg.rowHintMargin)) {
                return quadrant;
            }
            return null;
        },

        insert: function(quadrant, block) {
            var widgetCfg = {
                block: block
            },
                row;

            if (block && block.col) {
                block.col.remove(block);
            }

            row = editor.createRow(widgetCfg);

            row.grid = this.grid;

            if (quadrant === 'top') {
                row.element.insertBefore(this.element);
            } else {
                row.element.insertAfter(this.element);
            }
        },

        rebase: function() {
            //
            var $cols = this.element.find('[class*="col-"]'),
                ans = Math.floor(12 / $cols.length),
                rem = 12 % $cols.length;

            $cols.each(function(i, col) {
                var width = ans + (rem-- > 0 ? 1 : 0),
                    dropped = $(col).attr('class').indexOf('dropped-col') > -1;

                $(col).attr('class', 'col-' + width + '-12' + (dropped ? ' dropped-col' : ''));
            });
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

            this.isCol = true;
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

        offset: function() {
            if (!this._offset) {
                this._offset = this.element.offset();
                this._offset.width = this.element.width();
                this._offset.height = this.element.height();
                this._offset.target = this;
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

        quadrant: function(x, y) {
            var quadrant = editor.quadrant(x, y, this.offset()),
                ratio = Math.round(this.offset().width * cfg.colHintRatio),
                margin = ratio > cfg.colHintMargin ? ratio : cfg.colHintMargin;

            x -= this.offset().left;
            y -= this.offset().top;

            // Columns can only be inserted on left or right
            if ((quadrant === 'left' || quadrant === 'right') && (x <= margin || x >= this.offset().width - margin)) {
                return quadrant;
            }

            return null;
        },

        insert: function(quadrant, block) {
            var widgetCfg = {
                block: block
            },
                col;

            if (block && block.col) {
                block.col.remove(block);
            }

            col = editor.createCol(widgetCfg);

            col.row = this.row;

            if (quadrant === 'left') {
                col.element.insertBefore(this.element);
            } else {
                col.element.insertAfter(this.element);
            }

            this.row.rebase();

            setTimeout(function () {
                col.element.removeClass('dropped-col');
            }, 30);
        },

        rebase: function() {

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

            this.isBlock = true;
        },

        _onOver: function(e, ui) {
            this.initHint();
        },

        _onOut: function(e, ui) {

        },

        offset: function() {
            if (!this._offset) {
                this._offset = this.element.offset();
                this._offset.width = this.element.width();
                this._offset.height = this.element.height();
                this._offset.target = this;
            }
            return this._offset;
        },

        initHint: function() {
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

            this.offset().quadrant = (y <= this.offset().height / 2) ? 'top' : 'bottom';

            return this.offset();
        },

        insert: function(quadrant, block) {
            if (!block) {
                block = editor.createBlock();
            }

            if (block.col) {
                block.col.remove(block);
            }

            block.col = this.col;

            if (quadrant === 'top') {
                block.element.insertBefore(this.element);
            } else {
                block.element.insertAfter(this.element);
            }
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