<?php
/**
 * The sidebar containing front-page widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Luviana
 */

if ( ! is_active_sidebar( 'sidebar-5' ) ) {
    return;
}
?>

<div class="front-page-widget-area">
    <?php dynamic_sidebar( 'sidebar-5' ); ?>
</div><!-- #secondary -->
