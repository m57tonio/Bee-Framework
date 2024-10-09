<?php require_once INCLUDES . 'header.php'; ?>
<?php require_once INCLUDES . 'navbar.php'; ?>

<!-- Plantilla versión 1.0.5 -->
<div class="container">
  <div class="row">
    <div class="col-12">
      <?php echo Flasher::flash(); ?>
    </div>
    <div class="col-12 py-3">
      <h1 class="mb-3 float-start">Temarios creados</h1>
      <a href="apps_example/agregar" class="btn btn-success float-end">Agregar temario</a>
    </div>
    <div class="col-lg-12 col-12">

      <?php if (empty($d->temarios->rows)): ?>
        <div class="text-center py-5">
          <img src="<?php echo IMAGES.'file.png'; ?>" alt="No hay registros" class="img-fluid" style="width: 120px;">
          <p class="text-muted">No hay temarios en la base de datos.</p>
        </div>
      <?php else: ?>
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Número</th>
              <th>Título</th>
              <th>Lecciones</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($d->temarios->rows as $t): ?>
              <tr>
                <td><?php echo sprintf('<a href="apps_example/ver/%s">%s</a>', $t->id, $t->numero); ?></td>
                <td><?php echo empty($t->titulo) ? '<span class="text-muted">Sin título</span>' : add_ellipsis($t->titulo, 50); ?></td>
                <td><?php echo $t->total_lecciones; ?></td>
                <td><?php echo format_temario_estado($t->status); ?></td>
                <td><?php echo format_date($t->creado); ?></td>
                <td>
                  <div class="btn-group">
                    <a href="<?php echo sprintf('apps_example/ver/%s', $t->id); ?>" class="btn btn-success btn-sm"><i class="fas fa-eye"></i></a>
                    <a href="<?php echo buildURL(sprintf('apps_example/borrar/%s', $t->id)); ?>" class="btn btn-danger btn-sm confirmar"><i class="fas fa-trash"></i></a>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>

        <?php echo $d->temarios->pagination; ?>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php require_once INCLUDES . 'footer.php'; ?>