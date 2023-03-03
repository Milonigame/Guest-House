(function ($) {

    'use strict';

    function initMainNavigation(container) {
        // Add dropdown toggle that displays child menu items.
        var dropdownToggle = $('<button />', {
            'class': 'dropdown-toggle',
            'aria-expanded': false,
            'append': '<i class="fas fa-chevron-down"></i>'
        });

        container.find('.menu-item-has-children > a').after(dropdownToggle);

        // Toggle buttons and submenu items with active children menu items.
        container.find('.current-menu-ancestor > button').addClass('toggled-on');
        container.find('.current-menu-ancestor > .sub-menu').addClass('toggled-on');

        // Add menu items with submenus to aria-haspopup="true".
        container.find('.menu-item-has-children').attr('aria-haspopup', 'true');

        container.find('.dropdown-toggle').on('click', function (e) {
            var _this = $(this);

            e.preventDefault();
            _this.toggleClass('toggled-on');
            _this.next('.children, .sub-menu').toggleClass('toggled-on');

            _this.attr('aria-expanded', _this.attr('aria-expanded') === 'false' ? 'true' : 'false');

        });
    }

    initMainNavigation($('#primary-menu'));

    function subMenuPosition() {
        $('#primary-menu').find('.sub-menu').each(function () {
            $(this).removeClass('toleft');
            if (($(this).parent().offset().left + $(this).parent().width() - $(window).width() + 300) > 0) {
                $(this).addClass('toleft');
            }
        });
    }

    subMenuPosition();

    $(window).resize(function () {
        subMenuPosition();
    });

    let fpSlider = $('#child-pages-list');
    let fpVideo = $('#fp-slider-video');
    let fpSliderNav = $('#child-pages-nav-slider');

    // create video controls wrapper
    let fpVideoControlsContainer = $('<div/>', {
        'id': 'fp-slider-video-controls',
        'class': 'fp-slider-video-controls'
    });

    // create video pause button, add event listener, append to container
    let fpVideoPause = $('<button/>', {
        'class': 'pause'
    }).on('click', function (e) {
        fpVideo[0].paused ? fpVideo[0].play() : fpVideo[0].pause();
    }).appendTo(fpVideoControlsContainer);

    // create video mute button, add event listener, append to container
    let fpVideoMute = $('<button/>', {
        'class': 'mute'
    }).on('click', function (e) {
        $(this).toggleClass('active');
        fpVideo.prop('muted', !fpVideo.prop('muted'));
    }).appendTo(fpVideoControlsContainer);

    // add event listeners only if slider has video
    if (fpSlider.hasClass('has-video')) {
        fpSlider.on('init', function (slider) {
            // if slider has video append controls
            fpSlider.append(fpVideoControlsContainer);
            // add listeners on play/pause to change button icon
            fpVideo.on('play', function () {
                fpVideoPause.addClass('active');
            }).on('pause', function () {
                fpVideoPause.removeClass('active');
            });
            // change icon if video wasn't muted by default
            if (!fpVideo.prop('muted')) {
                fpVideoMute.addClass('active');
            }
        }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            // before slide change check if slide has video
            if ($(slick.$slides.get(nextSlide)).hasClass('front-page-slider-video')) {
                // if slide has video fadeIn controls
                fpVideoControlsContainer.fadeIn();
            } else {
                // else fadeOut controls after slider animation ends
                fpVideoControlsContainer.fadeOut();
                setTimeout(function () {
                    fpVideo[0].pause();
                }, fpSlider.data('speed'));
            }
        });
    }

    if ($.fn.slick) {
        fpSlider.slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: Boolean(fpSlider.data('fade')),
            speed: fpSlider.data('speed'),
            autoplay: Boolean(fpSlider.data('autoplay')),
            autoplaySpeed: fpSlider.data('autoplayspeed'),
            dots: true,
            arrows: false,
            rows: 0,
            waitForAnimate: false,
            asNavFor: '#child-pages-nav-slider'
        });

        fpSliderNav.slick({
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            centerMode: true,
            speed: 0,
            dots: false,
            arrows: false,
            rows: 0,
            vertical: true,
            focusOnSelect: true,
            asNavFor: '#child-pages-list'
        });

        $(window).load(function (e) {
            fpSliderNav.css('visibility', 'visible');
        });

        if(typeof fitty === 'function'){
            //wait some time to allow browser render element
            setTimeout(function (e) {
                fitty('.luviana-fit-text', {
                    minSize: 24,
                    maxSize: 80
                });
            }, 150);
        }
    }

})(jQuery);