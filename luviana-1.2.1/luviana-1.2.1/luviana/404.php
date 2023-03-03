<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Luviana
 */

get_header();
?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<section class="error-404 not-found">
				<header class="page-header">
                    <?php luviana_render_header_image();?>
					<h1 class="page-title"><?php echo esc_html_x( '404', '404 page title','luviana' ); ?></h1>
				</header><!-- .page-header -->

				<div class="page-content">
					<p><?php echo esc_html_x( 'Unfortunately the page you were looking for could not be found.', '404 page description', 'luviana' ); ?></p>

					<?php
					get_search_form();
					?>
                    <p>
                        <a class="button" href="<?php echo esc_url(get_home_url()); ?>"><?php echo esc_html__('go to home page', 'luviana');?></a>
                    </p>

				</div><!-- .page-content -->
			</section><!-- .error-404 -->

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
