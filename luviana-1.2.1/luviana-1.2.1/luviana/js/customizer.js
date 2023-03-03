/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

(function ($) {

    "use strict";

    // Site title and description.
    wp.customize('blogname', function (value) {
        value.bind(function (to) {
            $('.site-title a').text(to);
        });
    });
    wp.customize('blogdescription', function (value) {
        value.bind(function (to) {
            $('.site-description').text(to);
        });
    });

    // Header text color.
    wp.customize('header_textcolor', function (value) {
        let color = value.get();
        value.bind(function (to) {
            if ('blank' === to) {
                $('.site-title, .site-description').css({
                    'clip': 'rect(1px, 1px, 1px, 1px)',
                    'position': 'absolute'
                });
            } else {
                $('.site-title, .site-description').css({
                    'clip': 'auto',
                    'position': 'relative'
                });
            }
            let style = $('#luviana-default-header-css'),
                css = style.html();
            style.html(css.split(color).join(to));
            color = to;
        });
    });

    wp.customize('luviana_footer_text', function (value) {
        value.bind(function (to) {
            $('.site-info').html(to);
        })
    });

    wp.customize('luviana_fp_video_title', function (value) {
        value.bind(function (to) {
            $('.front-page-slider-video .child-page-title h2').html(to);
            $('.front-page-slider-video .child-page-first-letter').html(to.charAt(0));
        })
    });

    wp.customize('luviana_fp_video_text', function (value) {
        value.bind(function (to) {
            $('.front-page-slider-video .child-page-content').html(to);
        })
    });

    wp.customize('luviana_light_header_text_color', function (value) {
        let color = value.get();
        value.bind(function (to) {
            let style = $('#luviana-light-header-css'),
                css = style.html();
            style.html(css.split(color).join(to));
            color = to;
        })
    });

    wp.customize('luviana_accent_color', function (value) {
        let color = value.get();
        value.bind(function (to) {
            let style = $('#luviana-accent-color-css'),
                css = style.html(),
                hb_style = $('#luviana-hb-accent-color-css'),
                hb_css = hb_style.html();
            style.html(css.split(color).join(to));
            if (hb_css) {
                hb_style.html(hb_css.split(color).join(to));
            }
            color = to;
        })
    });

    wp.customize('luviana_secondary_color', function (value) {
        let color = value.get();
        value.bind(function (to) {
            let style = $('#luviana-secondary-color-css'),
                hb_style = $('#luviana-hb-secondary-color-css'),
                css = style.html(),
                hb_css = hb_style.html();
            style.html(css.split(color).join(to));
            if (hb_css) {
                hb_style.html(hb_css.split(color).join(to));
            }
            color = to;
        })
    });

})(jQuery);
