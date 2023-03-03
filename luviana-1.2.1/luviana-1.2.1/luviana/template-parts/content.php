<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Luviana
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php
        luviana_post_header();
    ?>

	<div class="entry-content">
		<?php
		the_content( sprintf(
			wp_kses(
				/* translators: %s: Name of current post. Only visible to screen readers */
				__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'luviana' ),
				array(
					'span' => array(
						'class' => array(),
					),
				)
			),
			get_the_title()
		) );

		wp_link_pages( array(
			'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'luviana' ),
			'after'  => '</div>',
		) );
		?>
	</div><!-- .entry-content -->

    <?php
    luviana_entry_footer();
    ?>
</article><!-- #post-<?php the_ID(); ?> -->
