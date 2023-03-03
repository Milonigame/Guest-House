<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Luviana
 */

if ( ! function_exists( 'luviana_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time.
	 */
	function luviana_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( DATE_W3C ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( DATE_W3C ) ),
			esc_html( get_the_modified_date() )
		);


		echo '<span class="posted-on"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a></span>'; // WPCS: XSS OK.

	}
endif;

if ( ! function_exists( 'luviana_posted_by' ) ) :
	/**
	 * Prints HTML with meta information for the current author.
	 */
	function luviana_posted_by() {
		?>
        <span class="byline">
            <span class="author vcard">
                <?php echo get_avatar( get_the_author_meta( 'ID' ), 32 ); ?>
                <a class="url fn n"
                   href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
                    <?php echo esc_html( get_the_author() ); ?>
                </a>
            </span>
        </span>
		<?php
	}
endif;

if ( ! function_exists( 'luviana_posted_in' ) ):

	function luviana_posted_in() {
		/* translators: used between list items, there is a space after the comma */
		$categories_list = get_the_category_list( esc_html__( ', ', 'luviana' ) );
		if ( $categories_list ) {
			/* translators: 1: list of categories. */
			printf( '<span class="cat-links"><i class="far fa-bookmark"></i>%1$s</span>', $categories_list ); // WPCS: XSS OK.
		}
	}

endif;

if ( ! function_exists( 'luviana_tagged' ) ):

	function luviana_tagged() {
		/* translators: used between list items, there is a space after the comma */
		$tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'luviana' ) );
		if ( $tags_list ) {
			printf( '<span class="tags-links"><i class="fas fa-tags"></i>%1$s</span>', $tags_list ); // WPCS: XSS OK.
		}
	}

endif;

if ( ! function_exists( 'luviana_short_comments_link' ) ):

	function luviana_short_commetns_link() {
		if ( comments_open() ) {
			echo '<span class="comments-link">';
			comments_popup_link( '<i class="fas fa-comments"></i> 0', '<i class="fas fa-comments"></i> 1', '<i class="fas fa-comments"></i> %1$s', '', '<i class="fas fa-comments"></i> 0' );
			echo '</span>';
		}
	}

endif;

if ( ! function_exists( 'luviana_entry_footer' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function luviana_entry_footer() {

		if ( 'post' === get_post_type() ) :
			?>
            <footer class="entry-footer">
				<?php
				luviana_tagged();
				luviana_posted_in();
				?>
            </footer>
		<?php
		endif;
	}
endif;

if ( ! function_exists( 'luviana_post_meta' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function luviana_post_meta() {

		if ( 'post' === get_post_type() ) :
			?>
            <div class="post-meta">
				<?php luviana_posted_by(); ?>
                <span class="post-meta-divider"></span>
				<?php luviana_posted_on(); ?>
                <span class="post-meta-divider"></span>
				<?php
				edit_post_link(
					sprintf(
						wp_kses(
						/* translators: %s: Name of current post. Only visible to screen readers */
							__( 'Edit <span class="screen-reader-text">%s</span>', 'luviana' ),
							array(
								'span' => array(
									'class' => array(),
								),
							)
						),
						get_the_title()
					),
					'<span class="edit-link">',
					'</span>'
				);
				?>
            </div>
		<?php
		endif;
	}
endif;

if ( ! function_exists( 'luviana_post_thumbnail' ) ) :
	/**
	 * Displays an optional post thumbnail.
	 *
	 * Wraps the post thumbnail in an anchor element on index views, or a div
	 * element when on single views.
	 *
	 */
	function luviana_post_thumbnail( $size = 'post-thumbnail' ) {
		if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
			return;
		}

		if ( is_singular() ) :
			?>

            <div class="post-thumbnail">
				<?php the_post_thumbnail( $size ); ?>
            </div><!-- .post-thumbnail -->

		<?php else : ?>

            <a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
				<?php
				the_post_thumbnail( $size, array(
					'alt' => the_title_attribute( array(
						'echo' => false,
					) ),
				) );
				?>
            </a>

		<?php
		endif; // End is_singular().
	}
endif;

if ( ! function_exists( 'luviana_page_header' ) ):

	function luviana_page_header() {
		$class = 'entry-header-wrapper';
		if ( ! has_post_thumbnail( get_the_ID() ) ) {
			$class .= ' no-image';
		}
		?>
        <div class="<?php echo esc_attr( $class ); ?>">
            <div class="entry-header-background">
				<?php the_post_thumbnail( 'luviana-x-large' ); ?>
            </div>
			<?php luviana_render_header_image(); ?>
            <header class="entry-header">
				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
            </header><!-- .entry-header -->
			<?php
			if ( has_excerpt() ):
				?>
                <div class="entry-summary">
					<?php
					the_excerpt();
					?>
                </div>
			<?php
			endif;
			?>

        </div>
		<?php
	}

endif;


if ( ! function_exists( 'luviana_post_header' ) ):

	function luviana_post_header() {
		?>
        <div class="entry-header-wrapper">

	        <?php luviana_render_header_image();?>

            <header class="entry-header">
				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
            </header><!-- .entry-header -->

			<?php
			luviana_post_meta();

			luviana_post_thumbnail();
			?>

        </div>
		<?php
	}

endif;

if ( ! function_exists( 'luviana_the_post_navigation' ) ) {
	function luviana_the_post_navigation() {
		?>
        <div class="post-navigation-wrapper">
			<?php
			the_post_navigation( array(
				'next_text' => '<div class="next"><div class="title">' .
				               '<span class="meta-nav" aria-hidden="true">' . esc_html__( 'Next', 'luviana' ) .
				               '<img src="' . get_template_directory_uri() . '/images/arrow_right.svg" alt="' . esc_attr__( 'Next', 'luviana' ) . '"></span> ' .
				               '<span class="post-title">%title</span></div>' .
				               '</div> ',
				'prev_text' => '<div class="previous"><div class="title">' .
				               '<span class="meta-nav" aria-hidden="true">' .
				               '<img src="' . get_template_directory_uri() . '/images/arrow_left.svg" alt="' . esc_attr__( 'Previous', 'luviana' ) . '">' . esc_html__( 'Previous', 'luviana' ) .
				               '</span> ' .
				               '<span class="post-title">%title</span></div>' .
				               '</div>'
			) );
			?>
        </div>
		<?php
	}
}

if ( ! function_exists( 'luviana_posts_pagination' ) ) {
	function luviana_posts_pagination() {
		the_posts_pagination( array(
			'mid_size'  => 1,
			'prev_text' => '<img src="' . get_template_directory_uri() . '/images/arrow_left.svg">' . esc_html__( 'Previous', 'luviana' ),
			'next_text' => esc_html__( 'Next', 'luviana' ) . '<img src="' . get_template_directory_uri() . '/images/arrow_right.svg">',
		) );
	}
}

if ( ! function_exists( 'luviana_front_page_header' ) ):
	function luviana_front_page_header() {

		$query = new WP_Query( array(
			'post_type'      => 'page',
			'posts_per_page' => - 1,
			'post_parent'    => get_the_ID(),
			'order'          => 'ASC',
			'orderby'        => 'menu_order',
			'post_status'    => 'publish'
		) );

		$video_enabled     = luviana_fp_video_enabled();
		$child_pages_count = $query->post_count;

		$has_one_slide             = ( ! $child_pages_count && $video_enabled ) || ( $child_pages_count == 1 && ! $video_enabled );

		if ( $query->have_posts() || $video_enabled ):
			$slider_fade = intval( get_theme_mod( 'luviana_fp_slider_enable_fade', true ) );
			$slider_autoplay       = intval( get_theme_mod( 'luviana_fp_slider_enable_autoplay', false ) );
			$slider_autoplay_speed = get_theme_mod( 'luviana_fp_slider_autoplay_speed', 2000 );
			$slider_speed          = get_theme_mod( 'luviana_fp_slider_slider_speed', 2000 );
			$slide_title_class     = luviana_fp_enable_title_fit() ? 'luviana-fit-text' : '';

			$slider_classes = [ 'child-pages-list' ];
			if ( $video_enabled ) {
				$slider_classes[] = 'has-video';
			}
			if ( $has_one_slide ) {
				$slider_classes[] = 'has-one-slide';
			}

			?>
            <div class="luviana-front-page-header">
                <div class="<?php echo esc_attr( implode( ' ', $slider_classes ) ); ?>" id="child-pages-list"
                     data-fade="<?php echo esc_attr( $slider_fade ); ?>"
                     data-autoplay="<?php echo esc_attr( $slider_autoplay ); ?>"
                     data-autoplaySpeed="<?php echo esc_attr( $slider_autoplay_speed ); ?>"
                     data-speed="<?php echo esc_attr( $slider_speed ); ?>"
                >
					<?php
					luviana_render_fp_slider_video( $video_enabled );
					while ( $query->have_posts() ):
						$query->the_post();
						?>
                        <div class="child-page">
                            <div class="child-page-thumbnail">
								<?php
								the_post_thumbnail( 'luviana-x-large' );
								?>
                            </div>
                            <div class="child-page-content-wrapper">
                                <div class="child-page-first-letter">
									<?php
									echo esc_html( get_the_title()[0] );
									?>
                                </div>
                                <div class="child-page-title">
									<?php the_title( '<h2 class="' . $slide_title_class . '">', '</h2>' ); ?>
                                </div>
                                <div class="child-page-content">
									<?php
									the_content( sprintf(
										wp_kses(
										/* translators: %s: Name of current post. Only visible to screen readers */
											__( 'More Info<span class="screen-reader-text"> "%s"</span>', 'luviana' ),
											array(
												'span' => array(
													'class' => array(),
												),
											)
										),
										get_the_title()
									) );
									?>
                                </div>
                            </div>
                        </div>
					<?php
					endwhile;
					?>
                </div>
				<?php
				if ( ! $has_one_slide ):
					?>
                    <div class="child-pages-nav-slider-wrapper">
                        <div class="child-pages-nav-slider slick-slider" id="child-pages-nav-slider">
							<?php
							luviana_render_fp_slider_video_poster( $video_enabled );
							while ( $query->have_posts() ):
								$query->the_post();
								?>
                                <div class="child-pages-nav-slider-item">
									<?php
									if ( has_post_thumbnail() ):
										the_post_thumbnail( 'luviana-x-small' );
									else :
										?>
                                        <div class="no-thumbnail">
											<?php
											echo esc_html( get_the_title()[0] );
											?>
                                        </div>
									<?php
									endif;
									?>
                                </div>
							<?php
							endwhile;
							?>
                        </div>
                    </div>
				<?php
				endif;
				?>
            </div>
		<?php
		else:
			luviana_page_header();
		endif;

		wp_reset_postdata();

	}
endif;

if ( ! function_exists( 'luviana_render_dark_logo' ) ):

	function luviana_render_logo() {
		if ( ! get_theme_mod( 'custom_logo' ) && ! get_theme_mod( 'luviana_dark_logo' ) ) {
			return;
		}
		?>
        <div class="logo-wrapper">
            <div class="white-logo">
				<?php
				the_custom_logo();
				?>
            </div>
            <div class="dark-logo">
				<?php
				if ( get_theme_mod( 'luviana_dark_logo' ) ):
					?>
                    <a class="custom-logo-link" href="<?php echo esc_url( home_url( '/' ) ) ?>">
                        <img class="custom-logo"
                             src="<?php echo esc_url( wp_get_attachment_image_src( absint( get_theme_mod( 'luviana_dark_logo' ) ) )[0] ); ?>"
                             alt="<?php echo esc_html( get_bloginfo( 'name', 'display' ) ); ?>">
                    </a>
				<?php
				else:
					the_custom_logo();
				endif;
				?>
            </div>
        </div>
		<?php
	}

endif;

if ( ! function_exists( 'luviana_render_fp_slider_video' ) ) {
	function luviana_render_fp_slider_video( $video_enabled ) {

		if ( ! $video_enabled ) {
			return;
		}

		$video_id = get_theme_mod( 'luviana_fp_video', false );

		$video_atts = [
			'autoplay',
			'muted',
			'loop'
		];

		if ( ! get_theme_mod( 'luviana_fp_video_autoplay', true ) ) {
			$video_atts = array_diff( $video_atts, [ 'autoplay' ] );
		}
		if ( ! get_theme_mod( 'luviana_fp_video_muted', true ) ) {
			$video_atts = array_diff( $video_atts, [ 'muted' ] );
		}
		if ( ! get_theme_mod( 'luviana_fp_video_loop', true ) ) {
			$video_atts = array_diff( $video_atts, [ 'loop' ] );
		};

		?>
        <div class="child-page front-page-slider-video">
            <div class="child-page-thumbnail">
                <video id="fp-slider-video" <?php echo esc_attr( implode( ' ', $video_atts ) ); ?>>
                    <source src="<?php echo esc_url( wp_get_attachment_url( $video_id ) ); ?>"
                            type="<?php echo esc_attr( get_post_mime_type( $video_id ) ); ?>">
					<?php
					$image_id = get_theme_mod( 'luviana_fp_video_poster', false );
					if ( $image_id ) {
						echo wp_kses_post( wp_get_attachment_image( $image_id, 'luviana-x-large' ) );
					}
					?>
                </video>
            </div>
            <div class="child-page-content-wrapper">
				<?php
				$title             = get_theme_mod( 'luviana_fp_video_title', false );
				$text              = get_theme_mod( 'luviana_fp_video_text', false );
				$slide_title_class = luviana_fp_enable_title_fit() ? 'luviana-fit-text' : '';
				?>
                <div class="child-page-first-letter">
					<?php
					if ( $title ) {
						echo esc_html( $title[0] );
					}
					?>
                </div>
                <div class="child-page-title">
					<?php
					if ( $title ) {
						echo '<h2 class="' . $slide_title_class . '">' . esc_html( $title ) . '</h2>';
					}
					?>
                </div>
                <div class="child-page-content">
					<?php
					if ( $text ) {
						echo wp_kses_post( $text );
					}
					?>
                </div>
            </div>
        </div>
		<?php
	}
}

if ( ! function_exists( 'luviana_render_fp_slider_video_poster' ) ) {
	function luviana_render_fp_slider_video_poster( $video_enabled ) {

		if ( ! $video_enabled ) {
			return;
		}

		$image_id = get_theme_mod( 'luviana_fp_video_poster', false );
		?>
        <div class="child-pages-nav-slider-item">
			<?php
			if ( $image_id ) :
				echo wp_kses_post( wp_get_attachment_image( $image_id, 'luviana-x-small' ) );
			else:
				?>
                <div class="no-thumbnail">
					<?php
					$title = get_theme_mod( 'luviana_fp_video_title', false );
					if ( $title ) {
						echo esc_html( $title[0] );
					}
					?>
                </div>
			<?php
			endif;
			?>
        </div>
		<?php
	}
}

function luviana_render_header_image() {
	if ( ! luviana_show_entry_header_image() ) {
		return;
	}
	?>
    <img class="entry-header-image"
         src="<?php echo esc_url( get_theme_mod( 'luviana_entry_header_image', get_template_directory_uri() . '/images/header_default.png' ) ); ?>"
         alt="<?php echo esc_attr__( 'Entry-header image', 'luviana' ); ?>">
	<?php
}
