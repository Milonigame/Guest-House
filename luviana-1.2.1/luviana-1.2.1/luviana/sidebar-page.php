<?php
if( ! is_active_sidebar('sidebar-6') ){
    return;
}
?>
<aside class="page-widgets widget-area">
    <div class="page-widgets-wrapper">
        <?php dynamic_sidebar( 'sidebar-6' ); ?>
    </div>
</aside>
