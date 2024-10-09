<?php if (!empty($d->lecciones)): ?>
  <div id="accordion">
    <?php foreach ($d->lecciones as $l): ?>
      <div class="group" data-id="<?php echo $l->id; ?>">
        <h3 class="clearfix">
          <span class="numeracion"></span>
          <?php echo sprintf('%s %s', format_tipo_leccion($l->tipo), $l->titulo); ?>
          <button class="btn btn-sm float-end update_leccion_status <?php echo $l->status === 'pendiente' ? 'btn-warning text-dark' : 'btn-success' ; ?>" data-id="<?php echo $l->id; ?>" data-status="<?php echo $l->status; ?>"><i class="fas fa-check"></i> Lista</button>
        </h3>
        <div>
          <?php echo empty($l->contenido) ? '<span class="text-muted">Sin contenido.</span>' : $l->contenido; ?>
          <div class="mt-3">
            <div class="btn-group">
              <button class="btn btn-success btn-sm open_update_leccion_form" data-id="<?php echo $l->id; ?>"><i class="fas fa-edit"></i></button>
              <button class="btn btn-danger btn-sm delete_leccion" data-id="<?php echo $l->id; ?>"><i class="fas fa-trash"></i></button>
            </div>
            
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php else: ?>
  <div class="text-center py-5">
    <img src="<?php echo IMAGES.'file.png'; ?>" alt="No hay lecciones" class="img-fluid" style="width: 120px;">
    <p class="text-muted">No hay lecciones disponibles.</p>
  </div>
<?php endif; ?>