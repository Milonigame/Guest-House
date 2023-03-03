<?php
/**
 * Template for displaying search forms in Luviana
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label>
        <span class="screen-reader-text"><?php echo esc_html_x( 'Search for:', 'label', 'luviana' ); ?></span>
        <input type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search &hellip;', 'placeholder', 'luviana' ); ?>" value="<?php echo get_search_query(); ?>" name="s" />
    </label>
    <button type="submit" class="search-submit"><i class="fas fa-search"></i><span class="screen-reader-text"><?php echo esc_html_x( 'Search', 'submit button', 'luviana' ); ?></span></button>
</form>