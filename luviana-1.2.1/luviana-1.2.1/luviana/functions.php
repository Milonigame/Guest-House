<?php
/**
 * Luviana functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Luviana
 */

if ( ! function_exists( 'luviana_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function luviana_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on Luviana, use a find and replace
		 * to change 'luviana' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'luviana', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		set_post_thumbnail_size( 1170 );

		add_image_size( 'luviana-x-large', 2560 );
		add_image_size( 'luviana-x-small', 140, 90, true );
		add_image_size( 'luviana-small', 370, 270, true );
		add_image_size( 'luviana-square', 992, 992, true );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'menu-1' => esc_html__( 'Primary', 'luviana' ),
			'menu-2' => esc_html__( 'Header Socials', 'luviana' ),
			'menu-3' => esc_html__( 'Footer', 'luviana' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'luviana_custom_background_args', array(
			'default-color' => 'eff6fb',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 60,
			'width'       => 60,
			'flex-width'  => true,
			'flex-height' => true,
		) );

		add_editor_style( array( 'css/editor-style.css', luviana_fonts_url() ) );

		add_post_type_support( 'page', 'excerpt' );

		add_theme_support( 'responsive-embeds' );

		add_theme_support( 'align-wide' );

		add_theme_support( 'editor-styles' );

		add_theme_support( 'editor-color-palette', array(
			array(
				'name'  => esc_html__( 'White', 'luviana' ),
				'slug'  => 'white',
				'color' => '#ffffff',
			),
			array(
				'name'  => esc_html__( 'Black', 'luviana' ),
				'slug'  => 'black',
				'color' => '#000000',
			),
			array(
				'name'  => esc_html__( 'Grey', 'luviana' ),
				'slug'  => 'grey',
				'color' => '#7b7f80',
			),
			array(
				'name'  => esc_html__( 'Light Grey', 'luviana' ),
				'slug'  => 'light-grey',
				'color' => '#f8f8f8',
			),
			array(
				'name'  => esc_html__( 'Dark Grey', 'luviana' ),
				'slug'  => 'dark-grey',
				'color' => '#121516',
			),
			array(
				'name'  => esc_html__( 'Gold', 'luviana' ),
				'slug'  => 'gold',
				'color' => '#c1b086',
			),
			array(
				'name'  => esc_html__( 'Blue', 'luviana' ),
				'slug'  => 'blue',
				'color' => '#3f9cc1',
			),
			array(
				'name'  => esc_html__( 'Dark Blue', 'luviana' ),
				'slug'  => 'dark-blue',
				'color' => '#252e59',
			),
		) );

	}
endif;
add_action( 'after_setup_theme', 'luviana_setup' );


/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function luviana_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'luviana_content_width', 770 );
}

add_action( 'after_setup_theme', 'luviana_content_width', 0 );


function luviana_adjust_content_width() {
	global $content_width;

	if ( is_page_template( 'template-wide-page.php' ) || is_page_template( 'template-front-page.php' ) ) {
		$content_width = 1170;
	}

}

add_action( 'template_redirect', 'luviana_adjust_content_width' );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function luviana_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Footer bottom 1', 'luviana' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'luviana' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Footer bottom 2', 'luviana' ),
		'id'            => 'sidebar-2',
		'description'   => esc_html__( 'Add widgets here.', 'luviana' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Footer bottom 3', 'luviana' ),
		'id'            => 'sidebar-3',
		'description'   => esc_html__( 'Add widgets here.', 'luviana' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Footer bottom 4', 'luviana' ),
		'id'            => 'sidebar-4',
		'description'   => esc_html__( 'Add widgets here.', 'luviana' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Front page', 'luviana' ),
		'id'            => 'sidebar-5',
		'description'   => esc_html__( 'Add widgets here.', 'luviana' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Page sidebar', 'luviana' ),
		'id'            => 'sidebar-6',
		'description'   => esc_html__( 'Add widgets here. Widgets for page template With Sidebar.', 'luviana' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
}

add_action( 'widgets_init', 'luviana_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function luviana_scripts() {

	wp_enqueue_style( 'luviana-fonts', luviana_fonts_url() );

	wp_enqueue_style( 'luviana-style', get_stylesheet_uri(), array(), luviana_get_theme_version() );

	wp_enqueue_style( 'font-awesome', get_template_directory_uri() . '/assets/font-awesome/css/all.min.css', array(), '5.5.0' );

	wp_enqueue_script( 'slick', get_template_directory_uri() . '/assets/slick/slick.min.js', array( 'jquery' ), '1.9.0', true );

	wp_enqueue_script( 'luviana-navigation', get_template_directory_uri() . '/js/navigation.js', array(), luviana_get_theme_version(), true );

	wp_enqueue_script( 'luviana-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), luviana_get_theme_version(), true );

	wp_register_script('fitty', get_template_directory_uri() . '/assets/fitty/fitty.min.js', array( 'jquery' ), '2.2.6', true );
	wp_register_style( 'slick', get_template_directory_uri() . '/assets/slick/slick.css', array(), '1.9.0' );
	wp_register_style( 'slick-theme', get_template_directory_uri() . '/assets/slick/slick-theme.css', array(), '1.9.0' );

	$dependencies = [
		'jquery'
	];

	if(is_page_template('template-front-page.php')){
		wp_enqueue_style('slick-theme');
		wp_enqueue_style('slick');
		$dependencies[] = 'slick';
		if(luviana_fp_enable_title_fit()){
			$dependencies[] = 'fitty';
		}
	}

	wp_enqueue_script( 'luviana-functions', get_template_directory_uri() . '/js/functions.js', $dependencies, luviana_get_theme_version(), true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}

add_action( 'wp_enqueue_scripts', 'luviana_scripts' );

function luviana_block_editor_assets() {

	wp_enqueue_script( 'luviana-blocks', get_template_directory_uri() . '/js/blocks.js', array(
		'wp-blocks',
		'wp-dom'
	), luviana_get_theme_version(), true );

}

add_action( 'enqueue_block_editor_assets', 'luviana_block_editor_assets' );

/**
 * Include TGMPA file.
 */
require get_template_directory() . '/inc/tgmpa-init.php';

/**
 * Include demo-import file.
 */
require get_template_directory() . '/inc/demo-import.php';

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Load MotoPress Hotel Booking compatibility file.
 */
if ( class_exists( 'HotelBookingPlugin' ) ) {
	require get_template_directory() . '/inc/mphb-functions.php';
}

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/customizer-front-page.php';
require get_template_directory() . '/inc/customizer-colors.php';

/**
 * Get theme vertion.
 *
 * @access public
 * @return string
 */
function luviana_get_theme_version() {
	$theme_info = wp_get_theme( get_template() );

	return $theme_info->get( 'Version' );
}

if ( ! function_exists( 'luviana_fonts_url' ) ) :
	/**
	 * Register Google fonts for luviana.
	 *
	 * Create your own luviana_fonts_url() function to override in a child theme.
	 *
	 * @return string Google fonts URL for the theme.
	 * @since Luviana 1.0.0
	 *
	 */
	function luviana_fonts_url() {
		$fonts_url     = '';
		$font_families = array();

		/**
		 * Translators: If there are characters in your language that are not
		 * supported by Noto Serif, translate this to 'off'. Do not translate
		 * into your own language.
		 */
		$playfair_display = esc_html_x( 'on', 'Noto Serif font: on or off', 'luviana' );
		if ( 'off' !== $playfair_display ) {
			$font_families[] = 'Noto Serif:400,400i,700,700i';
		}
		/**
		 * Translators: If there are characters in your language that are not
		 * supported by Open Sans, translate this to 'off'. Do not translate
		 * into your own language.
		 */
		$opensans = esc_html_x( 'on', 'Open Sans font: on or off', 'luviana' );
		if ( 'off' !== $opensans ) {
			$font_families[] = 'Open Sans:400,400i,600,700,700i';
		}

		$query_args = array(
			'family' => urlencode( implode( '|', $font_families ) ),
			'subset' => urlencode( 'latin,latin-ext,cyrillic' ),
		);
		if ( $font_families ) {
			$fonts_url = add_query_arg( $query_args, '//fonts.googleapis.com/css' );
		}

		return esc_url_raw( $fonts_url );
	}
endif;

add_action( 'getwid/icons-manager/init', 'luviana_getwid_add_custom_icons' );

function luviana_getwid_add_custom_icons( $manager ) {

	$beach_icons = [
		'icons'            => require( get_template_directory() . '/assets/beach-icons/beach-icons-list.php' ),
		'style'            => 'beach-icons',
		'enqueue_callback' => 'luvianna_enqueue_beach_icons_style'
	];

	$manager->registerFont( 'beach-icons', $beach_icons );

	$hotel_icons = [
		'icons'            => require( get_template_directory() . '/assets/hotel-icons/hotel-icons-list.php' ),
		'style'            => 'hotel-icons',
		'enqueue_callback' => 'luvianna_enqueue_hotel_icons_style'
	];

	$manager->registerFont( 'hotel-icons', $hotel_icons );

}

function luvianna_enqueue_beach_icons_style() {

	wp_enqueue_style( 'beach-icons', get_template_directory_uri() . '/assets/beach-icons/css/beach-icons.css' );

}

function luvianna_enqueue_hotel_icons_style() {

	wp_enqueue_style( 'hotel-icons', get_template_directory_uri() . '/assets/hotel-icons/css/hotel.css' );

}
