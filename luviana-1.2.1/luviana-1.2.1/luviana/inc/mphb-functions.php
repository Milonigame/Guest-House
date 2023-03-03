<?php

function luviana_mphb_scripts(){

    wp_enqueue_style('luviana-mphb', get_template_directory_uri() . '/css/motopress-hotel-booking.css', array(), luviana_get_theme_version());

}
add_action( 'wp_enqueue_scripts', 'luviana_mphb_scripts' );

add_filter('mphb_loop_room_type_gallery_use_nav_slider', 'luviana_remove_mphb_nav_gallery');
function luviana_remove_mphb_nav_gallery(){
    return false;
}

add_filter( 'mphb_single_room_type_gallery_image_size', function ($size){
    return 'luviana-small';
});

add_filter( 'mphb_loop_room_type_gallery_main_slider_image_size', function ($size){
    return 'luviana-square';
});

add_filter( 'mphb_single_room_type_image_size', function ($size){
    return 'post-thumbnail';
});

add_filter( 'mphb_loop_room_type_thumbnail_size', function ($size){
    return 'luviana-square';
});

add_filter( 'mphb_single_room_type_gallery_image_size', function ($size){
    return 'luviana-small';
});

add_filter( 'mphb_single_room_type_gallery_columns', function ($count){
    return 2;
});

function luviana_mphb_before_search_widget_default_fields(){
    ?>
    <div class="mphb-search-widget-default-fields">
    <?php
}
add_action('mphb_widget_search_form_top', 'luviana_mphb_before_search_widget_default_fields');

function luviana_mphb_before_search_widget_custom_fields(){
    ?>
    </div>
    <div class="mphb-search-widget-custom-fields">
    <?php
}
add_action('mphb_widget_search_form_before_attributes', 'luviana_mphb_before_search_widget_custom_fields');

function luviana_mphb_before_search_widget_submit_btn(){
    ?>
    </div>
    <?php
}
add_action('mphb_widget_search_form_before_submit_btn', 'luviana_mphb_before_search_widget_submit_btn');

function luviana_mphb_before_reservation_form(){
    ?>
    <div class="single-room-reservation-form">
        <div class="single-room-reservation-form-wrapper">
    <?php
}
add_action('mphb_render_single_room_type_metas', 'luviana_mphb_before_reservation_form', 45);

function luviana_mphb_after_reservation_form(){
    ?>
        </div>
    </div>
    <?php
}
add_action('mphb_render_single_room_type_metas', 'luviana_mphb_before_reservation_form', 45);

remove_action('mphb_render_single_room_type_metas', array('\MPHB\Views\SingleRoomTypeView','renderDefaultOrForDatesPrice'), 30);
add_action('mphb_render_single_room_type_metas', array('\MPHB\Views\SingleRoomTypeView','renderDefaultOrForDatesPrice'), 47);

remove_action( 'mphb_render_loop_room_type_attributes', array('\MPHB\Views\LoopRoomTypeView', 'renderFacilities'), 30 );
add_action( 'mphb_render_loop_room_type_attributes', array('\MPHB\Views\LoopRoomTypeView', 'renderFacilities'), 75 );

add_action('mphb_sc_rooms_before_loop', 'luviana_rooms_loop_wrapper_open');
add_action('mphb_sc_rooms_after_loop', 'luviana_rooms_loop_wrapper_close');

function luviana_rooms_loop_wrapper_open(){
	?>
	<div class="mphb-room-types-wrapper">
	<?php
}

function luviana_rooms_loop_wrapper_close(){
	?>
	</div>
	<?php
}

add_filter( 'mphb_pagination_args', 'luviana_rooms_pagination_atts');
function luviana_rooms_pagination_atts($atts){

    $atts['prev_text'] = '<img src="'.get_template_directory_uri().'/images/arrow_left.svg">'.esc_html__('Previous', 'luviana');
    $atts['next_text'] = esc_html__('Next', 'luviana').'<img src="'.get_template_directory_uri().'/images/arrow_right.svg">';

    return $atts;
}

add_action('mphb_sc_search_results_recommendation_before', 'luviana_before_search_recommendations');
function luviana_before_search_recommendations(){
    ?>
    <div class="mphb-search-recommendations-wrapper">
    <?php
}

add_action('mphb_sc_search_results_recommendation_after', 'luviana_after_search_recommendations');
function luviana_after_search_recommendations(){
    ?>
    </div>
    <?php
}