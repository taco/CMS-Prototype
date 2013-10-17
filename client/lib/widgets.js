(function ($, win, doc) {

    $.widget('custom.mozuGrid', {
        options: {},
        _create: function () {
            var me = this;

            console.log('init grid');

            this.rows = this.element.find('.grid').mozuRow({
                grid: this.element
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
            this.dragging = true;
            console.log('START');
         },

         _onOut: function (event, ui) {
            this.dragging = false;
            console.log('STOP');
         },

         _onDrop: function (event, ui) {
            console.log('DROPPED');
            this.dragging = false;
         },

         _onMouseover: function (e, ui) {
            console.log('DRAG OVER', e.clientX, e.clientY);
         }
    });

    $.widget('custom.mozuRow', {
        options: {
            grid: null
        },
        _create: function () {
            console.log('init row');
            this.cols = this.element.find('[class*="col-"]').mozuCol({
                row: this.element
            });
        }
    });

    $.widget('custom.mozuCol', {
        options: {
            row: null
        },
        _create: function () {
            console.log('init col');
            this.blocks = this.element.find('.block').mozuBlock({
                col: this.element
            });
        }
    });

    $.widget('custom.mozuBlock', {
        options: {
            col: null
        },
        _create: function () {
            console.log('init block');
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
                    //iframeFix: true,
                    revert: true,
                    helper: 'clone',
                    cursor: 'move',
                    cursorAt: {
                        left: 25,
                        bottom: 56
                    }
                });
        },
        print: function () {
            console.log(this.random);
        }
    });

    

}(jQuery, window, document));