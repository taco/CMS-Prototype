;
(function($, win, doc) {
    'use strict';

    var old = $.mzClassFactory;

    $.mzClassFactory = function(cls, pluginName) {
        var split = pluginName.split('.'),
            namespace = split[0],
            name = split[1],
            old;

        old = $.fn[name];

        $.fn[name] = function(option) {
            var args = arguments,
                ret,
                retDefault;
            
            retDefault = this.each(function() {
                var $this = $(this),
                    data = $this.data(pluginName),
                    options = typeof option === 'object' && option,
                    val;

                if (!data) $this.data(pluginName, (data = new cls(this, options)));
                if (typeof option === 'string') val = data[option].apply(data, Array.prototype.slice.call(args, 1));

                if (typeof val !== 'undefined' && val !== $this) {
                    ret = val;
                    return false;
                }
            });

            if (!ret) ret = retDefault;

            return ret;
        }

        $.fn[name].noConflict = function() {
            $.fn[name] = old;
            return this;
        }
    }

    $.mzClassFactory.noConflict = function() {
        $.mzClassFactory = old;
        return this;
    }
}(jQuery, window, document))