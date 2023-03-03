<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Luviana
 */

get_header();
?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

		<?php
		if ( have_posts() ) :

			if ( is_home() && ! is_front_page() ) :
				?>
				<header>
					<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
				</header>
				<?php
			endif;
                if( get_theme_mod('luviana_blog_layout', '') != '' ):
                ?>
                <div class="blog-wrapper">
                    <div class="blog-inner-wrapper">
                <?php
                endif;
                    /* Start the Loop */
                    while ( have_posts() ) :
                        the_post();

                        /*
                         * Include the Post-Type-specific template for the content.
                         * If you want to override this in a child theme, then include a file
                         * called content-loop-___.php (where ___ is the Post Type name) and that will be used instead.
                         */
                        switch ( get_theme_mod('luviana_blog_layout', '') ){
                            case 'grid':
                                get_template_part( 'template-parts/content-grid-loop', get_post_type() );
                                break;
                            case 'grid-2':
                                get_template_part( 'template-parts/content-grid-2-loop', get_post_type() );
                                break;
                            default :
                                get_template_part( 'template-parts/content-loop', get_post_type() );
                        }

                    endwhile;
                if( get_theme_mod('luviana_blog_layout', '') != '' ):
                ?>
                    </div>
                </div>
                <?php
                endif;
                luviana_posts_pagination();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
