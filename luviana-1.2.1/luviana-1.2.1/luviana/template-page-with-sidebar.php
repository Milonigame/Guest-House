<?php
/**
 *
 * Template Name: With Sidebar
 *
 * The template for displaying page with sidebar
 *
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Luviana
 */

get_header();
?>

    <div id="primary" class="content-area with-sidebar">
        <main id="main" class="site-main">

            <?php
            while ( have_posts() ) :
                the_post();

                get_template_part( 'template-parts/content-page');

                // If comments are open or we have at least one comment, load up the comment template.
                if ( comments_open() || get_comments_number() ) :
                    comments_template();
                endif;

            endwhile; // End of the loop.
            ?>

        </main><!-- #main -->
        <?php
        get_sidebar('page');
        ?>
    </div><!-- #primary -->

<?php
get_footer();
