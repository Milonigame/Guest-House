<?php
/**
 * Luviana Theme Customizer
 *
 * @package Luviana
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function luviana_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial( 'blogname', array(
			'selector'        => '.site-title a',
			'render_callback' => 'luviana_customize_partial_blogname',
		) );
		$wp_customize->selective_refresh->add_partial( 'blogdescription', array(
			'selector'        => '.site-description',
			'render_callback' => 'luviana_customize_partial_blogdescription',
		) );
	}

	$wp_customize->add_panel( 'luviana_theme_options', array(
		'title' => esc_html__( 'Theme Options', 'luviana' ),
	) );

	$wp_customize->add_section( 'luviana_footer_options', array(
		'title' => esc_html__( 'Footer Options', 'luviana' ),
		'panel' => 'luviana_theme_options'
	) );

	$wp_customize->add_setting( 'luviana_show_footer_text', array(
		'default'           => true,
		'transport'         => 'refresh',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );

	$wp_customize->add_control( 'luviana_show_footer_text', array(
			'label'    => esc_html__( 'Show Footer Text?', 'luviana' ),
			'section'  => 'luviana_footer_options',
			'type'     => 'checkbox',
			'settings' => 'luviana_show_footer_text'
		)
	);

	$default_footer_text = esc_html_x( '%1$s &copy; %2$s All Rights Reserved', 'Default footer text, %1$s - blog name, %2$s - current year', 'luviana' );
	$wp_customize->add_setting( 'luviana_footer_text', array(
		'default'           => $default_footer_text,
		'transport'         => 'postMessage',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'luviana_sanitize_textarea'
	) );

	$wp_customize->add_control( 'luviana_footer_text', array(
			'label'       => esc_html__( 'Footer Text', 'luviana' ),
			'description' => esc_html__( 'Use %1$s to insert the blog name, %2$s to insert the current year. Doesn`t work for Live Preview.', 'luviana' ),
			'section'     => 'luviana_footer_options',
			'type'        => 'textarea',
			'settings'    => 'luviana_footer_text'
		)
	);

	$wp_customize->add_section( 'luviana_header_options', array(
		'title' => esc_html__( 'Header Options', 'luviana' ),
		'panel' => 'luviana_theme_options'
	) );

	$wp_customize->add_setting( 'luviana_show_entry_header_image', array(
		'default'           => true,
		'sanitize_callback' => 'luviana_sanitize_checkbox'
	) );
	$wp_customize->add_control( 'luviana_show_entry_header_image', array(
		'label'    => esc_html__( 'Show header image', 'luviana' ),
		'section'  => 'luviana_header_options',
		'type'     => 'checkbox',
		'settings' => 'luviana_show_entry_header_image'
	) );

	$wp_customize->add_setting( 'luviana_entry_header_image', array(
		'default'           => get_template_directory_uri() . '/images/header_default.png',
		'sanitize_callback' => 'luviana_sanitize_image'
	) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'luviana_entry_header_image', array(
		'label'    => esc_html__( 'Header Image', 'luviana' ),
		'section'  => 'luviana_header_options',
		'settings' => 'luviana_entry_header_image',
	) ) );


	$wp_customize->add_section( 'luviana_blog_options', array(
		'title' => esc_html__( 'Blog Options', 'luviana' ),
		'panel' => 'luviana_theme_options'
	) );

	$wp_customize->add_setting( 'luviana_blog_layout', array(
		'default'           => '',
		'sanitize_callback' => 'luviana_sanitize_select'
	) );
	$wp_customize->add_control( 'luviana_blog_layout', array(
		'type'    => 'select',
		'section' => 'luviana_blog_options',
		'label'   => esc_html__( 'Blog layout', 'luviana' ),
		'choices' => array(
			''       => esc_html__( 'Default', 'luviana' ),
			'grid'   => esc_html__( 'Grid', 'luviana' ),
			'grid-2' => esc_html__( 'Grid 2', 'luviana' )
		),
	) );

	$wp_customize->add_section( 'luviana_global_options', array(
		'title' => esc_html__( 'Site Options', 'luviana' ),
		'panel' => 'luviana_theme_options'
	) );

	$wp_customize->add_setting( 'luviana_site_layout', array(
		'default'           => '',
		'sanitize_callback' => 'luviana_sanitize_select'
	) );
	$wp_customize->add_control( 'luviana_site_layout', array(
		'type'    => 'select',
		'section' => 'luviana_global_options',
		'label'   => esc_html__( 'Site layout', 'luviana' ),
		'choices' => array(
			''     => esc_html__( 'Boxed', 'luviana' ),
			'wide' => esc_html__( 'Wide', 'luviana' ),
		),
	) );

	$wp_customize->add_setting( 'luviana_dark_logo', array(
		'sanitize_callback' => 'absint'
	) );

	$custom_logo_args = get_theme_support( 'custom-logo' );
	$wp_customize->add_control( new WP_Customize_Cropped_Image_Control( $wp_customize, 'luviana_dark_logo', array(
		'label'         => esc_html__( 'Dark Logo', 'luviana' ),
		'section'       => 'title_tagline',
		'settings'      => 'luviana_dark_logo',
		'priority'      => 9,
		'height'        => $custom_logo_args[0]['height'],
		'width'         => $custom_logo_args[0]['width'],
		'flex_height'   => $custom_logo_args[0]['flex-height'],
		'flex_width'    => $custom_logo_args[0]['flex-width'],
		'button_labels' => array(
			'select' => esc_html__( 'Select Dark Logo', 'luviana' ),
		)
	) ) );
}

add_action( 'customize_register', 'luviana_customize_register' );

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function luviana_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function luviana_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function luviana_customize_preview_js() {
	wp_enqueue_script( 'luviana-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), luviana_get_theme_version(), true );
}

add_action( 'customize_preview_init', 'luviana_customize_preview_js' );


function luviana_sanitize_checkbox( $checked ) {

	//returns true if checkbox is checked
	return ( ( isset( $checked ) && true == $checked ) ? true : false );
}

function luviana_sanitize_textarea( $string ) {
	return wp_kses_post( $string );
}

function luviana_sanitize_image( $input, $setting ) {
	return esc_url_raw( luviana_validate_image( $input, $setting->default ) );
}

function luviana_validate_image( $input, $default = '' ) {
	// Array of valid image file types
	// The array includes image mime types
	// that are included in wp_get_mime_types()
	$mimes = array(
		'jpg|jpeg|jpe' => 'image/jpeg',
		'gif'          => 'image/gif',
		'png'          => 'image/png',
		'bmp'          => 'image/bmp',
		'tif|tiff'     => 'image/tiff',
	);
	// Return an array with file extension
	// and mime_type
	$file = wp_check_filetype( $input, $mimes );
	// If $input has a valid mime_type,
	// return it; otherwise, return
	// the default.
	return ( $file['ext'] ? $input : $default );
}

function luviana_sanitize_select( $input, $setting ) {

	//input must be a slug: lowercase alphanumeric characters, dashes and underscores are allowed only
	$input = sanitize_key( $input );

	//get the list of possible select options
	$choices = $setting->manager->get_control( $setting->id )->choices;

	//return input if valid or return default option
	return ( array_key_exists( $input, $choices ) ? $input : $setting->default );

}