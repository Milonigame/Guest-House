<?php

function luviana_get_default_colors() {
	return [
		'header'       => '#' . get_theme_support( 'custom-header', 'default-text-color' ),
		'header_light' => '#fafafa',
		'accent'       => '#c1b086',
		'secondary'    => '#252e59',
		'fp_search'    => '#3f9cc1'
	];
}

function luviana_get_default_color( $color ) {
	$colors = luviana_get_default_colors();
	if ( ! array_key_exists( $color, $colors ) ) {
		return false;
	}

	return $colors[ $color ];
}

function luviana_get_generated_colors() {

	$default_colors = luviana_get_default_colors();

	return [
		'header'       => '#' . get_header_textcolor(),
		'header_light' => get_theme_mod( 'luviana_light_header_text_color', $default_colors['header_light'] ),
		'accent'       => get_theme_mod( 'luviana_accent_color', $default_colors['accent'] ),
		'secondary'    => get_theme_mod( 'luviana_secondary_color', $default_colors['secondary'] ),
		'fp_search'    => get_theme_mod( 'luviana_fp_search_color', $default_colors['fp_search'] ),
	];
}

function luviana_customize_colors_register( WP_Customize_Manager $wp_customize ) {

	$default_colors = luviana_get_default_colors();

	$wp_customize->add_setting( 'luviana_light_header_text_color', array(
		'default'           => $default_colors['header_light'],
		'transport'         => 'postMessage',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_hex_color'
	) );

	$wp_customize->add_control( new  WP_Customize_Color_Control( $wp_customize, 'luviana_light_header_text_color', array(
		'label'    => esc_html__( 'Light Header Text Color', 'luviana' ),
		'section'  => 'colors',
		'settings' => 'luviana_light_header_text_color',
	) ) );

	$wp_customize->add_setting( 'luviana_accent_color', array(
		'default'           => $default_colors['accent'],
		'transport'         => 'postMessage',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_hex_color'
	) );

	$wp_customize->add_control( new  WP_Customize_Color_Control( $wp_customize, 'luviana_accent_color', array(
		'label'    => esc_html__( 'Accent Color', 'luviana' ),
		'section'  => 'colors',
		'settings' => 'luviana_accent_color',
	) ) );

	$wp_customize->add_setting( 'luviana_secondary_color', array(
		'default'           => $default_colors['secondary'],
		'transport'         => 'postMessage',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_hex_color'
	) );

	$wp_customize->add_control( new  WP_Customize_Color_Control( $wp_customize, 'luviana_secondary_color', array(
		'label'    => esc_html__( 'Secondary Color', 'luviana' ),
		'section'  => 'colors',
		'settings' => 'luviana_secondary_color',
	) ) );

}

add_action( 'customize_register', 'luviana_customize_colors_register' );

function luviana_get_default_header_css( $color, $is_editor = false, $editor_prefix = '' ) {

	if ( $is_editor ) {
		return '';
	}

	return <<<CSS
		.site-header{
			color: {$color};
		}
CSS;
}

function luviana_get_light_header_css( $color, $is_editor = false, $editor_prefix = '' ) {

	if ( $is_editor ) {
		return '';
	}

	return <<<CSS
		body.absolute-menu .site-header{
			color: {$color}
		}

		body.absolute-menu .site-header .main-navigation{
			border-color: {$color}40;
		}
CSS;
}

function luviana_get_accent_color_css( $color, $is_editor = false, $editor_prefix = '' ) {
	$general        = <<<CSS
		button,
		input[type="button"],
		input[type="reset"],
		input[type="submit"],
		.more-link,
		.luviana-front-page-header .child-pages-list .child-page-content .more-link:hover {
		  background: {$color};
		  border-color: {$color};
		}
		.navigation.pagination .page-numbers:hover,
		.navigation.pagination .current,
		body.blog-layout-grid .blog-wrapper .blog-inner-wrapper .hentry .post-meta-wrapper .featured,
		body.blog-layout-grid-2 .hentry .featured,
		.post-thumbnail-wrapper .featured {
			background: {$color};
		}
				
		.post-navigation-wrapper .post-navigation a:hover .post-title,
		.post-navigation-wrapper .post-navigation a:focus .post-title,
		.navigation.pagination .prev:hover,
		.navigation.pagination .next:hover,
		.widget_recent_entries ul li:before,
		.widget_recent_entries ul li a:hover,
		.widget_recent_entries .post-date,
		.widget_nav_menu .menu a:hover,
		.search-form .search-submit:hover,
		.search-form .search-submit:focus,
		.site-info-wrapper .footer-menu-container .footer-menu li:after,
		body.blog .site-main > .hentry .entry-header a:hover,
		body.archive .site-main > .hentry .entry-header a:hover,
		body.search .site-main > .hentry .entry-header a:hover,
		body.blog-layout-grid .blog-wrapper .blog-inner-wrapper .hentry .entry-header .entry-title a:hover,
		body.blog-layout-grid-2 .hentry .entry-header .posted-on a:hover,
		.entry-footer > span > i,
		.entry-footer > span a:hover,
		.comment-list .comment .reply:before {
			color: {$color};
		}
CSS;
	$editor_related = <<<CSS
		{$editor_prefix} .button{
			background: {$color};
			border-color: {$color};
		}
		
		{$editor_prefix} .wp-block-quote{
			border-color: {$color};
		}
		
		{$editor_prefix} a,
		{$editor_prefix} .wp-block-quote cite,
		{$editor_prefix} .wp-block-quote .wp-block-quote__citation,
		{$editor_prefix} .wp-block-quote.is-large cite,
		{$editor_prefix} .wp-block-quote.is-large .wp-block-quote__citation,
		{$editor_prefix} .wp-block-quote.is-style-large cite,
		{$editor_prefix} .wp-block-quote.is-style-large .wp-block-quote__citation,
		{$editor_prefix} .wp-block-pullquote blockquote cite,
		{$editor_prefix} .wp-block-pullquote blockquote .wp-block-pullquote__citation,
		{$editor_prefix} .wp-block-button.is-style-outline .wp-block-button__link:not(.has-text-color),
		{$editor_prefix} .wp-block-button.is-style-link .wp-block-button__link:not(.has-text-color),
		{$editor_prefix} .wp-block-button.is-style-link .wp-block-button__link:hover,
		{$editor_prefix} .wp-block-getwid-accordion .wp-block-getwid-accordion__header-wrapper.ui-state-active a, 
		{$editor_prefix} .wp-block-getwid-accordion .wp-block-getwid-accordion__header-wrapper:hover a,
		{$editor_prefix} .wp-block-getwid-accordion .wp-block-getwid-accordion__icon,
		{$editor_prefix} .wp-block-getwid-recent-posts .wp-block-getwid-recent-posts__post .wp-block-getwid-recent-posts__post-title a:hover,
		{$editor_prefix} .wp-block-getwid-recent-posts .wp-block-getwid-recent-posts__post .wp-block-getwid-recent-posts__entry-meta .wp-block-getwid-recent-posts__post-tags a,
		{$editor_prefix} .wp-block-getwid-toggle .wp-block-getwid-toggle__row .wp-block-getwid-toggle__header:hover a,
		{$editor_prefix} .wp-block-getwid-toggle .wp-block-getwid-toggle__row .wp-block-getwid-toggle__header:hover .wp-block-getwid-toggle__icon,
		{$editor_prefix} .wp-block-getwid-toggle .wp-block-getwid-toggle__row .wp-block-getwid-toggle__icon,
		{$editor_prefix} .wp-block-getwid-toggle .wp-block-getwid-toggle__row.is-active .wp-block-getwid-toggle__header a,
		{$editor_prefix} .wp-block-getwid-tabs .wp-block-getwid-tabs__nav-links .wp-block-getwid-tabs__nav-link:hover a,
		{$editor_prefix} .wp-block-getwid-progress-bar .wp-block-getwid-progress-bar__progress:not(.has-text-color),
		{$editor_prefix} .wp-block-getwid-post-slider .wp-block-getwid-post-slider__post-title a:hover,
		{$editor_prefix} .wp-block-getwid-post-carousel .wp-block-getwid-post-carousel__post-title a:hover,
		{$editor_prefix} .wp-block-getwid-custom-post-type .wp-block-getwid-custom-post-type__post-title a:hover {
			color: {$color};
		}
		
		{$editor_prefix} .wp-block-button.is-style-outline .wp-block-button__link:not(.has-text-color):hover{
			color: #fff;
		}
		
		{$editor_prefix} .wp-block-button.is-style-outline .wp-block-button__link{
		    background: transparent;
		}
		
		{$editor_prefix} .wp-block-pullquote {	
		  border-top-color: {$color};
		  border-bottom-color: {$color};
		}
		
		{$editor_prefix} .wp-block-button__link:not(.has-background),
		{$editor_prefix} .wp-block-file .wp-block-file__button:not(.has-background),
		{$editor_prefix} .wp-block-getwid-price-box .wp-block-getwid-price-box__pricing:after{
			background: {$color};
		}
		
		{$editor_prefix} .wp-block-button__link.has-dark-blue-background-color:hover,
		{$editor_prefix} .wp-block-file .wp-block-file__button.has-dark-blue-background-color:hover {
		  background-color: {$color};
		  border-color: {$color};
		}
		
		{$editor_prefix} .wp-block-getwid-media-text-slider .slick-prev:hover,
		{$editor_prefix} .wp-block-getwid-media-text-slider .slick-next:hover,
		{$editor_prefix} .wp-block-getwid-images-slider .slick-prev:hover,
		{$editor_prefix} .wp-block-getwid-images-slider .slick-next:hover,
		{$editor_prefix} .wp-block-getwid-advanced-heading.is-style-style-1 .wp-block-getwid-advanced-heading__content:before,
		{$editor_prefix} .wp-block-getwid-post-slider .slick-prev:hover,
		{$editor_prefix} .wp-block-getwid-post-slider .slick-next:hover,
		{$editor_prefix} .wp-block-getwid-post-carousel .slick-prev:hover,
		{$editor_prefix} .wp-block-getwid-post-carousel .slick-next:hover{
			background-color: {$color};
		}
CSS;

	if ( $is_editor ) {
		return $editor_related;
	}

	return $general . $editor_related;
}

function luviana_get_secondary_color_css( $color, $is_editor = false, $editor_prefix = '' ) {
	$general        = <<<CSS
		code, 
		kbd, 
		tt, 
		var,
		.main-navigation ul ul li:hover > a, 
		.main-navigation ul ul li.current-menu-item > a,
		.front-page-widget-area,
		body.page-has-post-thumbnail .entry-header-background,
		body.page-has-post-thumbnail .entry-header-background:after,
		.luviana-front-page-header .child-pages-nav-slider .no-thumbnail{
			background: {$color};
		}
		
		button:hover,
		input[type="button"]:hover,
		input[type="reset"]:hover,
		input[type="submit"]:hover,
		.more-link:hover,
		button:active, 
		button:focus,
		input[type="button"]:active,
		input[type="button"]:focus,
		input[type="reset"]:active,
		input[type="reset"]:focus,
		input[type="submit"]:active,
		input[type="submit"]:focus,
		.more-link:active,
		.more-link:focus{
			border-color: {$color};
			background: {$color};
		}
		
		.front-page-widget-area input[type="text"],
		.front-page-widget-area input[type="email"],
		.front-page-widget-area input[type="url"],
		.front-page-widget-area input[type="password"],
		.front-page-widget-area input[type="search"],
		.front-page-widget-area input[type="number"],
		.front-page-widget-area input[type="tel"],
		.front-page-widget-area input[type="range"],
		.front-page-widget-area input[type="date"],
		.front-page-widget-area input[type="month"],
		.front-page-widget-area input[type="week"],
		.front-page-widget-area input[type="time"],
		.front-page-widget-area input[type="datetime"],
		.front-page-widget-area input[type="datetime-local"],
		.front-page-widget-area input[type="color"],
		.front-page-widget-area textarea,
		.front-page-widget-area select {
			background-color: {$color};
		}
		
		body.blog-layout-grid .blog-wrapper .blog-inner-wrapper .hentry .post-thumbnail:before {
			background: -webkit-gradient(linear, left top, left bottom, from({$color}), to(transparent));
			background: linear-gradient(to bottom, {$color}, transparent);
		}
CSS;
	$editor_related = <<<CSS
		{$editor_prefix} .wp-block-getwid-social-links .wp-block-getwid-social-links__link:hover .wp-block-getwid-social-links__wrapper,
		{$editor_prefix} .wp-block-getwid-social-links.has-icons-framed .wp-block-getwid-social-links__link:hover .wp-block-getwid-social-links__wrapper {
			color: {$color};
		}
		
		{$editor_prefix} .wp-block-getwid-social-links.has-icons-stacked .wp-block-getwid-social-links__link:hover .wp-block-getwid-social-links__wrapper {
			background: {$color};
		}
		
		{$editor_prefix} .button:active,
		{$editor_prefix} .button:focus,
		{$editor_prefix} .button:hover,
		{$editor_prefix} .wp-block-button__link:hover,
		{$editor_prefix} .wp-block-file .wp-block-file__button:hover,
		{$editor_prefix} .wp-block-button.is-style-outline .wp-block-button__link:hover {
			border-color: {$color};
			background: {$color};
		}
CSS;

	if ( $is_editor ) {
		return $editor_related;
	}

	return $general . $editor_related;
}

function luviana_get_booking_accent_color_css( $color, $is_editor = false, $editor_prefix = '' ) {
	$general = <<<CSS
		.mphb-widget-room-type-attributes li:before,		
		.mphb-widget-room-type-attributes a:hover,		
		.datepick-popup .datepick-cmd-next:hover,
		.datepick-popup .datepick-cmd-prev:hover,
		.datepick-popup a.datepick-cmd.datepick-cmd-today,		
		.datepick-popup .datepick-nav a:hover,		
		.datepick-popup .datepick-ctrl a,	
		.page-widgets .widget_mphb_rooms_widget .mphb_room_type .mphb-widget-room-type-title a:hover,		
		.comments-area .mphbr-star-rating > span {
		  color: {$color};
		}
		
		.datepick-popup .mphb-datepick-popup .datepick-month td a.datepick-selected,
		.datepick-popup .mphb-datepick-popup .datepick-month td a.datepick-today.datepick-selected,
		.datepick-popup .mphb-datepick-popup .datepick-month td a.datepick-today.datepick-highlight,
		.datepick-popup .mphb-datepick-popup .datepick-month td span.datepick-today.datepick-selected,
		.datepick-popup .mphb-datepick-popup .datepick-month td span.datepick-today.datepick-highlight,
		body .mphb-flexslider.flexslider ul.flex-direction-nav a:hover,
		body .flexslider ul.flex-direction-nav a:hover {
		  background-color: {$color};
		}
		
		.datepick-popup .mphb-datepick-popup .datepick-month td a.datepick-highlight,
		.datepick-popup .mphb-datepick-popup .datepick-month td .mphb-check-in-date {
		  background: {$color};
		}
		
		.page-widgets .widget_mphb_rooms_widget .mphb_room_type .mphb-widget-room-type-book-button .button {
		  background: {$color};
		  border-color: {$color};
		}
		
		.page-widgets .widget_mphb_rooms_widget .mphb_room_type .mphb-widget-room-type-book-button .button:hover {
		  color: {$color};
		  border-color: {$color};
		}
		
		.content-area .hentry .entry-content .mphb_sc_search_results-wrapper .mphb_room_type .mphb-rooms-reservation-message-wrapper{
		  border-color: {$color}; 
		}
		
        .front-page-widget-area .widget_mphb_search_availability_widget .mphb_widget_search-submit-button-wrapper .button {
			background: {$color};
		}
CSS;

	$editor_related = <<<CSS
        {$editor_prefix} .mphb-loop-room-type-attributes li:before,
		{$editor_prefix} .mphb-single-room-type-attributes li:before,
		{$editor_prefix} .mphb-loop-room-type-attributes a:hover,
		{$editor_prefix} .mphb-single-room-type-attributes a:hover,
		{$editor_prefix} .mphb-single-room-type-attributes li .mphb-attribute-value a:hover,
		{$editor_prefix} .mphb-calendar .datepick-cmd-next:hover,
		{$editor_prefix} .mphb-calendar .datepick-cmd-prev:hover,
		{$editor_prefix} .mphb-calendar a.datepick-cmd.datepick-cmd-today,
		{$editor_prefix} .mphb-calendar .datepick-nav a:hover,
		{$editor_prefix} .mphb-calendar .datepick-ctrl a,
		{$editor_prefix} .mphb_sc_checkout-wrapper .mphb-coupon-code-wrapper .mphb-apply-coupon-code-button:hover,
		{$editor_prefix} .mphb_sc_checkout-wrapper .mphb_sc_checkout-submit-wrapper .button:hover,
		{$editor_prefix} .mphb_sc_services-wrapper .type-mphb_room_service .mphb-service-title a:hover,
		{$editor_prefix} .mphb_sc_search_results-wrapper .mphb-room-type-title:hover,
		{$editor_prefix} .mphb_sc_rooms-wrapper .mphb-room-type-title:hover,
		{$editor_prefix} .mphb_sc_room-wrapper .mphb-room-type-title:hover {
		  color: {$color};
		}
		
		{$editor_prefix} .mphb-calendar.mphb-datepick .datepick-month td a.datepick-selected,
		{$editor_prefix} .mphb-calendar.mphb-datepick .datepick-month td a.datepick-today.datepick-selected, .mphb-calendar.mphb-datepick .datepick-month td a.datepick-today.datepick-highlight,
		{$editor_prefix} .mphb-calendar.mphb-datepick .datepick-month td .mphb-booked-date,
		{$editor_prefix} .mphb-calendar.mphb-datepick .datepick-month td span.datepick-today.datepick-highlight,
		{$editor_prefix} .mphb-calendar.mphb-datepick .datepick-month td span.datepick-today.datepick-selected {
		  background-color: {$color};
		}
		
		{$editor_prefix} .mphb-calendar.mphb-datepick .datepick-month td a.datepick-highlight,
		{$editor_prefix} .mphb-calendar.mphb-datepick .datepick-month td .mphb-check-in-date,
		{$editor_prefix} .mphb_sc_rooms-wrapper .entry-title:before {
		  background: {$color};
		}		
CSS;

	if ( $is_editor ) {
		return $editor_related;
	}

	return $general . $editor_related;
}

function luviana_get_booking_secondary_color_css( $color, $is_editor = false, $editor_prefix = '' ) {

	$general = <<<CSS
    .mphb_sc_checkout-wrapper .mphb-coupon-code-wrapper .mphb-apply-coupon-code-button,
    .mphb_sc_checkout-wrapper .mphb_sc_checkout-submit-wrapper .button,
    .content-area .hentry .entry-content .mphb_sc_search_results-wrapper .mphb_room_type .mphb-view-details-button:hover {
        background: {$color};
        border-color: {$color};
    }

    .front-page-widget-area .widget_mphb_search_availability_widget .mphb_widget_search-submit-button-wrapper .button:hover {
        background: {$color};
    }
CSS;

	$editor_related = <<<CSS
    {$editor_prefix} .mphb_sc_rooms-wrapper .mphb-view-details-button:hover {
        background: {$color};
        border-color: {$color};
    }
CSS;

	if ( $is_editor ) {
		return $editor_related;
	}

	return $general . $editor_related;

}

function luviana_generate_customizer_styles( $is_editor = false, $editor_prefix = '' ) {

	$hb_active = class_exists( 'HotelBookingPlugin' );
	$hb_css    = '';

	$css           = '';
	$default_color = luviana_get_default_color( 'header' );
	$color         = '#' . get_header_textcolor();
	if ( $default_color && $color !== $default_color ) {
		$css .= luviana_get_default_header_css( $color, $is_editor, $editor_prefix );
	}

	$default_color = luviana_get_default_color( 'header_light' );
	$color         = get_theme_mod( 'luviana_light_header_text_color', $default_color );
	if ( $default_color && $color !== $default_color ) {
		$css .= luviana_get_light_header_css( $color, $is_editor, $editor_prefix );
	}

	$default_color = luviana_get_default_color( 'accent' );
	$color         = get_theme_mod( 'luviana_accent_color', $default_color );
	if ( $default_color && $color !== $default_color ) {
		$css .= luviana_get_accent_color_css( $color, $is_editor, $editor_prefix );
		if ( $hb_active ) {
			$hb_css .= luviana_get_booking_accent_color_css( $color, $is_editor, $editor_prefix );
		}
	}

	$default_color = luviana_get_default_color( 'secondary' );
	$color         = get_theme_mod( 'luviana_secondary_color', $default_color );
	if ( $default_color && $color !== $default_color ) {
		$css .= luviana_get_secondary_color_css( $color, $is_editor, $editor_prefix );
		if ( $hb_active ) {
			$hb_css .= luviana_get_booking_secondary_color_css( $color, $is_editor, $editor_prefix );
		}
	}

	return [
		'style'    => $css,
		'hb_style' => $hb_css
	];
}

function luviana_enqueue_customizer_styles() {

	if ( is_customize_preview() ) {
		return;
	}

	$styles = luviana_generate_customizer_styles();
	$css    = $styles['style'];
	$hb_css = $styles['hb_style'];

	if ( $css != '' ) {
		wp_add_inline_style( 'luviana-style', $css );
	}

	if ( $hb_css != '' ) {
		wp_add_inline_style( 'luviana-mphb', $hb_css );
	}
}

add_action( 'wp_enqueue_scripts', 'luviana_enqueue_customizer_styles' );

function luviana_enqueue_block_editor_customizer_styles() {

	$styles = luviana_generate_customizer_styles( true, '.editor-block-list__layout .editor-block-list__block-edit' );
	$css    = $styles['style'] . $styles['hb_style'];

	if ( $css != '' ) {
		//register fake stylesheet which allow add inline style
		wp_register_style( 'luviana-editor-customizer', false );
		wp_enqueue_style( 'luviana-editor-customizer' );
		wp_add_inline_style( 'luviana-editor-customizer', $css );
	}
}

add_action( 'enqueue_block_editor_assets', 'luviana_enqueue_block_editor_customizer_styles' );

function luviana_customize_preview_css() {
	if ( ! is_customize_preview() ) {
		return;
	}
	$colors = luviana_get_generated_colors();
	?>
    <style id="luviana-default-header-css">
        <?php
		echo luviana_get_default_header_css( $colors['header'] );
		?>
    </style>
    <style id="luviana-light-header-css">
        <?php
		echo luviana_get_light_header_css( $colors['header_light'] );
		?>
    </style>
    <style id="luviana-accent-color-css">
        <?php
		echo luviana_get_accent_color_css( $colors['accent'] );
		?>
    </style>
    <style id="luviana-secondary-color-css">
        <?php
		echo luviana_get_secondary_color_css( $colors['secondary'] );
		?>
    </style>
	<?php
	if ( class_exists( 'HotelBookingPlugin' ) ):
		?>
        <style id="luviana-hb-accent-color-css">
            <?php
			echo luviana_get_booking_accent_color_css( $colors['accent'] );
			?>
        </style>
        <style id="luviana-hb-secondary-color-css">
            <?php
			echo luviana_get_booking_secondary_color_css( $colors['secondary'] );
			?>
        </style>
	<?php
	endif;
}

add_action( 'wp_head', 'luviana_customize_preview_css' );