<?php

/**
 *
 * Demo data
 *
 **/

function luviana_ocdi_import_files() {
	$import_notice = '<h4>' . __( 'Important note before importing sample data.', 'luviana' ) . '</h4>';
    $import_notice .= __( 'Data import is generally not immediate and can take up to 10 minutes.', 'luviana' ) . '<br/>';
    $import_notice .= __( 'After you import this demo, you will have to configure the Instagram API key and Google Maps API key separately.', 'luviana' );

	$import_notice = wp_kses(
		$import_notice,
		array(
			'a' => array(
				'href' => array(),
			),
			'ol' => array(),
			'li' => array(),
			'h4' => array(),
			'br' => array(),
		)
	);

    return array(
        array(
            'import_file_name'             => 'Demo Import 1',
            'local_import_file'            => trailingslashit( get_template_directory() ) . 'assets/demo-data/luviana.xml',
            'local_import_widget_file'     => trailingslashit( get_template_directory() ) . 'assets/demo-data/luviana-widgets.wie',
            'import_preview_image_url'     => '',
            'import_notice'                => $import_notice,
            'preview_url'                  => 'https://themes.getmotopress.com/luviana',
        ),
    );
}
add_filter( 'pt-ocdi/import_files', 'luviana_ocdi_import_files' );

function luviana_ocdi_after_import_setup() {

    // Assign menus to their locations.
    $menu1 = get_term_by( 'slug', 'primary', 'nav_menu' );
	$menu2 = get_term_by( 'slug', 'socials', 'nav_menu' );
	$menu3 = get_term_by( 'slug', 'footer', 'nav_menu' );

	set_theme_mod( 'nav_menu_locations', array(
            'menu-1' => $menu1->term_id,
            'menu-2' => $menu2->term_id,
            'menu-3' => $menu3->term_id,
        )
    );

    $menu4 = get_term_by( 'name', 'Footer Widget', 'nav_menu' );
    $nav_menu_widget = get_option('widget_nav_menu');

    if( $nav_menu_widget ) {
        if ($menu4 && !empty($nav_menu_widget[2])) {
            $nav_menu_widget[2]['nav_menu'] = $menu4->term_id;
        }
    }

    // Assign front page and posts page (blog page).
    $front_page_id = get_page_by_title( 'Home' );
    $blog_page_id  = get_page_by_title( 'Blog' );

	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $front_page_id->ID );
	update_option( 'page_for_posts', $blog_page_id->ID );

	// Assign Hotel Booking default pages.
	$search_results_page        = get_page_by_title('Search Results');
	$booking_confirmation_page  = get_page_by_title('Booking Confirmation');
	$terms_conditions_page      = get_page_by_title('Terms and Conditions');
	$booking_confirmed_page     = get_page_by_title('Booking Confirmed');
	$booking_cancelled_page     = get_page_by_title('Booking Cancelled');

	update_option('mphb_search_results_page', $search_results_page->ID);
	update_option('mphb_checkout_page', $booking_confirmation_page->ID);
	update_option('mphb_terms_and_conditions_page', $terms_conditions_page->ID);
	update_option('mphb_booking_confirmation_page',$booking_confirmed_page->ID);
	update_option('mphb_user_cancel_redirect_page', $booking_cancelled_page->ID);

	// skip hotel booking wizard
	update_option( 'mphb_wizard_passed', true);

	update_option('getwid_section_content_width', 1170);

    //update taxonomies
    $update_taxonomies = array(
        'post_tag',
        'category'
    );

    foreach ($update_taxonomies as $taxonomy ) {
		luviana_ocdi_update_taxonomy( $taxonomy );
    }

	//set site default logo
	$args = array(
		'post_type' => 'attachment',
		'name' => 'logotype',
		'posts_per_page' => 1,
		'post_status' => 'inherit',
	);

	$_logo = get_posts( $args );
	$logo = $_logo ? array_pop($_logo) : null;
	if($logo){
		set_theme_mod('custom_logo', $logo->ID);
	}

	//set site default logo
	$args = array(
		'post_type' => 'attachment',
		'name' => 'logotype_gold',
		'posts_per_page' => 1,
		'post_status' => 'inherit',
	);

	$_logo = get_posts( $args );
	$logo = $_logo ? array_pop($_logo) : null;
	if($logo){
		set_theme_mod('luviana_dark_logo', $logo->ID);
	}

    //hide site title
    //set_theme_mod( 'header_textcolor', 'blank');

}
add_action( 'pt-ocdi/after_import', 'luviana_ocdi_after_import_setup' );

// Disable generation of smaller images (thumbnails) during the content import
//add_filter( 'pt-ocdi/regenerate_thumbnails_in_content_import', '__return_false' );

// Disable the branding notice
add_filter( 'pt-ocdi/disable_pt_branding', '__return_true' );

function luviana_ocdi_update_taxonomy( $taxonomy ) {
    $get_terms_args = array(
        'taxonomy' => $taxonomy,
        'fields' => 'ids',
        'hide_empty' => false,
    );

    $update_terms = get_terms($get_terms_args);
    if ( $taxonomy && $update_terms ) {
        wp_update_term_count_now($update_terms, $taxonomy);
    }
}