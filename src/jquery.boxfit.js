(function (window, $, undefined) {
'use strict';

var boxfit = function ($nodes, options) {
    var settings = {
        width: null,
        height: null,
        step_size: 1,
        step_limit: 200,
        align_middle: true,
        align_center: true,
        multiline: false,
        minimum_font_size: 5,
        maximum_font_size: null,
        line_height:'100%',
        truncate_text: true,
        onComplete: function () {},
        custom_truncate_container: false
    }

    settings = $.extend(settings, options);

    var smallest_font = 999;

    $nodes.each(function () {
        var current_step, inner_span, next_font_size, original_height, original_text, original_width, span, current_font_size;

        if (settings.width) {
            original_width = settings.width;

            $(this).width(original_width + 'px');
        } else {
            original_width = $(this).width();
        }

        if (settings.height) {
            original_height = settings.height;

            $(this).height(original_height + 'px');
        } else {
            original_height = $(this).height();
        }

        if (!original_width || !original_height) {
            if (window.console !== null) {
                return console.info('Set static height/width on target DIV before using boxfit! Detected width:',  original_width, 'height: ', original_height);
            }
        } else {
            if (!settings.multiline) {
                $(this).css('white-space', 'nowrap');
            }

            original_text = $(this).html();

            if ($('<div>' + original_text + '</div>').find('span.boxfitted').length === 0) {
                span = $('<span></span>', {
                    'class': 'boxfitted',
                    html: original_text
                });

                $(this).html(span);
            } else {
                span = $($(this).find('span.boxfitted')[0]);
            }

            current_step = 0;
            inner_span = span;
            $(this).css('display', 'table');
            inner_span.css('display', 'table-cell');

            if (settings.align_middle) {
                inner_span.css('vertical-align', 'middle');
            }

            if (settings.align_center) {
                $(this).css('text-align', 'center');
                inner_span.css('text-align', 'center');
            }

            inner_span.css({
                'line-height': settings.line_height,
                'font-size': settings.minimum_font_size
            });

            while ($(this).width() <= original_width && $(this).height() <= original_height) {
                if (current_step++ > settings.step_limit) {
                    break;
                }

                next_font_size = parseInt(inner_span.css('font-size'), 10);

                if (settings.maximum_font_size && next_font_size > settings.maximum_font_size) {
                    break;
                }

                inner_span.css('font-size', next_font_size + settings.step_size);
            }

            current_font_size = parseInt(inner_span.css('font-size'), 10) - settings.step_size;

            if (current_font_size < settings.minimum_font_size) {
                current_font_size = settings.minimum_font_size;
            }

            if (current_font_size < smallest_font) {
                smallest_font = current_font_size 
            }

            inner_span.css('font-size', current_font_size);

            if (settings.truncate_text) {
                var text, text_container;

                if (settings.custom_truncate_container) {
                    text_container = settings.custom_truncate_container($(this));
                } else {
                    text_container = $(this);
                }

                text = text_container.html().trim();

                while ($(this).width() > original_width || $(this).height() > original_height) {

                    text = text.slice(0, -1);

                    if (!text.length) {
                        break;
                    }

                    text_container.html(text);
                }
            }
        }
    });

    settings.onComplete($nodes, smallest_font);
    return $nodes;
}

$.fn.boxfit = function (options) {
    return boxfit(this, options);
}

}(window, jQuery, undefined));