<?php require_once INCLUDES.'inc_bee_header.php'; ?>

<div class="container">
  <div class="row">
    <div class="col-6 offset-xl-3 py-5">
      <a href="<?php echo get_base_url(); ?>"><img src="<?php echo get_bee_logo(); ?>" alt="<?php echo get_bee_name(); ?>" class="img-fluid" style="width: 200px;"></a>
      <h2 class="mt-5 mb-3"><span class="text-warning">Bee</span> framework</h2>
      <!-- contenido -->
      <div class="border rounded shadow p-3">
        <img src="<?php echo $d->url; ?>" alt="" class="img-fluid">
      </div>
    </div>
  </div>
</div>

<?php require_once INCLUDES.'inc_bee_footer.php'; ?>