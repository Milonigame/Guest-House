<?php
if( ! is_active_sidebar('sidebar-1') &&
    ! is_active_sidebar('sidebar-2') &&
    ! is_active_sidebar('sidebar-3') &&
    ! is_active_sidebar('sidebar-4') ){
    return;
}
?>
<div class="footer-widgets">
    <div class="wrapper">
        <div class="footer-widgets-wrapper">
            <?php
            if( is_active_sidebar('sidebar-1') ):
                ?>
                <div class="widget-area">
                    <?php dynamic_sidebar( 'sidebar-1' ); ?>
                </div>
                <?php
            endif;

            if( is_active_sidebar('sidebar-2') ):
                ?>
                <div class="widget-area">
                    <?php dynamic_sidebar( 'sidebar-2' ); ?>
                </div>
                <?php
            endif;

            if( is_active_sidebar('sidebar-3') ):
                ?>
                <div class="widget-area">
                    <?php dynamic_sidebar( 'sidebar-3' ); ?>
                </div>
                <?php
            endif;

            if( is_active_sidebar('sidebar-4') ):
                ?>
                <div class="widget-area">
                    <?php dynamic_sidebar( 'sidebar-4' ); ?>
                </div>
                <?php
            endif;
            ?>
        </div>
    </div>
</div>
