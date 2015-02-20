(function (window, $) {
'use strict';

var boxfit = function ($nodes, options) {

return $nodes.each(function () {
    var current_step, inner_span, next_font_size, original_height, original_text, original_width, settings, span;
        settings = {
        width: null,
        height: null,
        step_size: 1,
        step_limit: 200,
        align_middle: true,
        align_center: true,
        multiline: false,
        minimum_font_size: 5,
        maximum_font_size: null,
        line_height:'100%'
    };

    $.extend(settings, options);

    var $that = $(this);

    // take measurements
    if (settings.width) {
        original_width = settings.width;
        $that.width(original_width + 'px');
    } else {
        original_width = $that.width();
    }

    if (settings.height) {
        original_height = settings.height;
        $that.height(original_height + 'px');
    } else {
        original_height = $that.height();
    }

    if (!original_width || !original_height) {
        if (window.console !== null) {
            return console.info('Set static height/width on target DIV before using boxfit! Detected width: ' + original_width + ' height: ' + original_height);
        }
    } else {
        if (!settings.multiline) {
            $that.css('white-space', 'nowrap');
        }

        original_text = $that.html();

        if ($('<div>' + original_text + '</div>').find('span.boxfitted').length === 0) {
            span = $($('<span></span>', {
                'class': 'boxfitted',
                html: original_text
            });

            $that.html(span);
        } else {
            span = $($that.find('span.boxfitted')[0]);
        }

        current_step = 0;
        inner_span = span;
        $that.css('display', 'table');
        inner_span.css('display', 'table-cell');

        if (settings.align_middle) {
            inner_span.css('vertical-align', 'middle');
        }

        if (settings.align_center) {
            $that.css('text-align', 'center');
            inner_span.css('text-align', 'center');
        }

        // fixing issue where custom line-heights would break wrapped text
        inner_span.css('line-height', settings.line_height);

        // keep growing the target so long as we haven't exceeded the width or height
        inner_span.css('font-size', settings.minimum_font_size);

        while ($that.width() <= original_width && $that.height() <= original_height) {
            if (current_step++ > settings.step_limit) {
                break;
            }

            next_font_size = parseInt(inner_span.css('font-size'), 10);

            if (settings.maximum_font_size && next_font_size > settings.maximum_font_size) {
                break;
            }

            inner_span.css('font-size', next_font_size + settings.step_size);
        }

        // go back one step
        inner_span.css('font-size', parseInt(inner_span.css('font-size'), 10) - settings.step_size);

        return $that;
    }

    });
};

$.fn.boxfit = function (options) {
    return boxfit(this, options);
};

return boxfit;
}(window, jQuery));
