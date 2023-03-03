<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Luviana
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'luviana' ); ?></a>

	<header id="masthead" class="<?php echo esc_attr(apply_filters('luviana_site_header_classes', 'site-header '));?>">
        <div class="site-header-wrapper">
            <div class="site-branding">
                <?php
                luviana_render_logo();
                ?>
                <div class="site-title-wrapper">
                    <?php
                    if ( is_front_page() && is_home() ) :
                        ?>
                        <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
                        <?php
                    else :
                        ?>
                        <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
                        <?php
                    endif;
                    $luviana_description = get_bloginfo( 'description', 'display' );
                    if ( $luviana_description || is_customize_preview() ) :
                        ?>
                        <p class="site-description"><?php echo esc_html($luviana_description); /* WPCS: xss ok. */ ?></p>
                    <?php endif; ?>
                </div>
            </div><!-- .site-branding -->

            <?php
            if(has_nav_menu('menu-1')):
            ?>
                <nav id="site-navigation" class="main-navigation">
                    <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                        <span class="line"></span>
                        <span class="line"></span>
                        <span class="line"></span>
                    </button>
                    <div class="header-menus-wrapper">
                        <?php
                        wp_nav_menu( array(
                            'theme_location' => 'menu-1',
                            'menu_id'        => 'primary-menu',
                            'container'      => false,
                        ) );

                        if(has_nav_menu('menu-2')){
                            wp_nav_menu( array(
                                'theme_location'    => 'menu-2',
                                'menu_id'           => 'socials-menu socials-menu-mobile',
                                'menu_class'        => 'socials-menu socials-menu-mobile theme-social-menu',
                                'container_class'   => 'socials-menu-mobile-container',
                                'link_before'       => '<span class="menu-text">',
                                'link_after'        => '</span>',
                                'depth'             => 1,

                            ) );
                        }
                        ?>
                    </div>
                </nav><!-- #site-navigation -->
            <?php
            endif;

            if(has_nav_menu('menu-2')){
                wp_nav_menu( array(
                    'theme_location'    => 'menu-2',
                    'menu_id'           => 'socials-menu',
                    'menu_class'        => 'socials-menu theme-social-menu',
                    'container_class'   => 'socials-menu-container',
                    'link_before'       => '<span class="menu-text">',
                    'link_after'        => '</span>',
                    'depth'             => 1,

                ) );
            }
            ?>
        </div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
