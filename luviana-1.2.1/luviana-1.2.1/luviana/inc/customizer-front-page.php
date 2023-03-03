<?php
/**
 * this file contains customizer settings for front page header
 *
 * @param WP_Customize_Manager $wp_customize
 */

function luviana_customize_front_page_register( WP_Customize_Manager $wp_customize ) {

	$customizer_section = 'luviana_front_page_slider';

	$wp_customize->add_section( 'luviana_front_page_slider', array(
		'title' => esc_html__( 'Front Page Slider', 'luviana' ),
		'panel' => 'luviana_theme_options'
	) );

	$wp_customize->add_setting( 'luviana_fp_slider_enable_title_fit', array(
		'default'           => true,
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_fp_slider_enable_title_fit', array(
		'label'    => esc_html__( 'Enable one-line text fitting for the title', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'checkbox',
		'settings' => 'luviana_fp_slider_enable_title_fit'
	) );

	$wp_customize->add_setting( 'luviana_fp_slider_enable_autoplay', array(
		'default'           => false,
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_fp_slider_enable_autoplay', array(
		'label'    => esc_html__( 'Enable slideshow', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'checkbox',
		'settings' => 'luviana_fp_slider_enable_autoplay'
	) );

	$wp_customize->add_setting( 'luviana_fp_slider_autoplay_speed', array(
		'default'           => 2000,
		'sanitize_callback' => 'absint'
	) );
	$wp_customize->add_control( 'luviana_fp_slider_autoplay_speed', array(
		'label'       => esc_html__( 'Slideshow speed', 'luviana' ),
		'section'     => $customizer_section,
		'type'        => 'number',
		'input_attrs' => array(
			'min'  => 200,
			'max'  => 10000,
			'step' => 200
		)
	) );

	$wp_customize->add_setting( 'luviana_fp_slider_enable_fade', array(
		'default'           => true,
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_fp_slider_enable_fade', array(
		'label'    => esc_html__( 'Use fade animation effect', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'checkbox',
		'settings' => 'luviana_fp_slider_enable_fade'
	) );

	$wp_customize->add_setting( 'luviana_fp_slider_slide_speed', array(
		'default'           => 1000,
		'sanitize_callback' => 'absint'
	) );
	$wp_customize->add_control( 'luviana_fp_slider_slide_speed', array(
		'label'       => esc_html__( 'Animation speed', 'luviana' ),
		'section'     => $customizer_section,
		'type'        => 'number',
		'input_attrs' => array(
			'min'  => 100,
			'max'  => 5000,
			'step' => 100
		)
	) );

	$wp_customize->add_setting( 'luviana_fp_enable_video', array(
		'default'           => false,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_fp_enable_video', array(
		'label'    => esc_html__( 'Enable video as a first slide', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'checkbox',
		'settings' => 'luviana_fp_enable_video'
	) );

	$wp_customize->add_setting( 'luviana_fp_video_autoplay', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_fp_video_autoplay', array(
		'label'    => esc_html__( 'Autoplay video', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'checkbox',
		'settings' => 'luviana_fp_video_autoplay'
	) );

	$wp_customize->add_setting( 'luviana_fp_video_muted', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_fp_video_muted', array(
		'label'    => esc_html__( 'Mute video', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'checkbox',
		'settings' => 'luviana_fp_video_muted'
	) );

	$wp_customize->add_setting( 'luviana_fp_video_loop', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_fp_video_loop', array(
		'label'    => esc_html__( 'Loop video', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'checkbox',
		'settings' => 'luviana_fp_video_loop'
	) );

	$wp_customize->add_setting( 'luviana_fp_video', array(
		'default'           => '',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'absint',
	) );
	$wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, 'luviana_fp_video', array(
		'label'     => esc_html__( 'Video', 'luviana' ),
		'section'   => $customizer_section,
		'mime_type' => 'video',  // Required. Can be image, audio, video, application, text
	) ) );

	$wp_customize->add_setting( 'luviana_fp_video_poster', array(
		'type'              => 'theme_mod',
		'sanitize_callback' => 'absint',
	) );
	$wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, 'luviana_fp_video_poster', array(
		'label'     => esc_html__( 'Video Poster', 'luviana' ),
		'section'   => $customizer_section,
		'mime_type' => 'image',  // Required. Can be image, audio, video, application, text
	) ) );

	$wp_customize->add_setting( 'luviana_fp_video_title', array(
		'default'           => '',
		'transport'         => 'postMessage',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'wp_filter_nohtml_kses'
	) );

	$wp_customize->add_control( 'luviana_fp_video_title', array(
		'label'    => esc_html__( 'Video Title', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'text',
		'settings' => 'luviana_fp_video_title'
	) );

	$wp_customize->add_setting( 'luviana_fp_video_text', array(
		'default'           => '',
		'transport'         => 'postMessage',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'luviana_sanitize_textarea'
	) );

	$wp_customize->add_control( 'luviana_fp_video_text', array(
		'label'    => esc_html__( 'Video Caption', 'luviana' ),
		'section'  => $customizer_section,
		'type'     => 'textarea',
		'settings' => 'luviana_fp_video_text'
	) );

}

add_action( 'customize_register', 'luviana_customize_front_page_register' );
