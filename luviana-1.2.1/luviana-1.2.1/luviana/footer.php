<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Luviana
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer">

        <?php get_sidebar('footer'); ?>

        <div class="site-info-wrapper">
            <div class="wrapper">
                <?php
                if( get_theme_mod('luviana_show_footer_text', true) == true ):
                ?>
                <div class="site-info">
                    <?php
                        $dateObj = new DateTime;
                        $year    = $dateObj->format( "Y" );
                        printf(
                            get_theme_mod('luviana_footer_text',
                                sprintf(
                                    esc_html_x('%1$s &copy; %2$s All Rights Reserved', 'Default footer text, %1$s - blog name, %2$s - current year', 'luviana' ),
                                    get_bloginfo('name'),
                                    $year
                                )
                            ),
                            get_bloginfo('name'),
                            $year
                        );
                    ?>
                </div><!-- .site-info -->
                <?php
                endif;

                if(has_nav_menu('menu-3')){
                    wp_nav_menu( array(
                        'theme_location'    => 'menu-3',
                        'menu_id'           => 'footer-menu',
                        'menu_class'        => 'footer-menu',
                        'container_class'   => 'footer-menu-container',
                        'depth'             => 1
                    ) );
                }
                ?>
            </div>
        </div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
