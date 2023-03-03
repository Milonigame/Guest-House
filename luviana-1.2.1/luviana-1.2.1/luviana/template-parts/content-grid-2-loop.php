<?php
/**
 * Template part for displaying posts in grid blog
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Luviana
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="post-wrapper">
        <div class="post-meta-wrapper">
            <?php
            luviana_post_thumbnail();

            if(is_sticky()):
                ?>
                <span class="featured"><?php echo esc_html__('Featured', 'luviana');?></span>
            <?php
            endif;
            ?>
        </div>

        <header class="entry-header">
            <?php
            the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );

            luviana_posted_on();
            ?>
        </header><!-- .entry-header -->
    </div>
</article><!-- #post-<?php the_ID(); ?> -->
