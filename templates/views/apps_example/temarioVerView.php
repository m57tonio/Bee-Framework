<?php require_once INCLUDES . 'header.php'; ?>
<?php require_once INCLUDES . 'navbar.php'; ?>

<!-- Plantilla versión 1.0.5 -->
<div class="container">
  <div class="row">
    <div class="col-12">
      <?php echo Flasher::flash(); ?>
    </div>
    <div class="col-12 py-3">
      <h1 class="mb-3 float-start"><?php echo $d->title; ?></h1>
      <div class="btn-group float-end">
        <a href="<?php echo buildURL(sprintf('apps_example/descargar/%s', $d->t->id)); ?>" class="btn btn-success"><i class="fas fa-file"></i> Descargar</a>
        <a href="apps_example/temario" class="btn btn-danger">Regresar</a>
      </div>
    </div>
  </div>
</div>
<div class="container">
  <div class="row">
    <div class="col-lg-4">
      <div class="card mb-3">
        <div class="card-header">Detalles del temario</div>
        <div class="card-body">
          <form id="temario_form">
            <input type="hidden" name="id" value="<?php echo $d->t->id; ?>" required>
            <?php echo insert_inputs(); ?>

            <div class="mb-3">
              <label for="titulo">Título</label>
              <input type="text" class="form-control" name="titulo" id="titulo" value="<?php echo $d->t->titulo; ?>">
            </div>

            <div class="mb-3">
              <label for="descripcion">Descripción</label>
              <textarea class="form-control" name="descripcion" id="descripcion" cols="3" rows="3"><?php echo $d->t->descripcion; ?></textarea>
            </div>

            <button class="btn btn-success" type="submit">Guardar cambios</button>
          </form>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">Agregar lección</div>
        <div class="card-body">
          <form id="add_leccion_form">
            <input type="hidden" name="id_temario" value="<?php echo $d->t->id; ?>" required>
            <?php echo insert_inputs(); ?>

            <div class="mb-3">
              <label for="l_titulo">Título</label>
              <input type="text" class="form-control" name="titulo" id="l_titulo" required>
            </div>

            <div class="mb-3">
              <label for="l_tipo">Tipo de lección</label>
              <select name="tipo" id="l_tipo" class="form-select">
                <?php foreach (get_tipo_lecciones() as $tipo): ?>
                  <?php echo sprintf('<option value="%s">%s</option>', $tipo[0], $tipo[1]); ?>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="mb-3">
              <label for="l_contenido">Contenido</label>
              <textarea class="form-control" name="contenido" id="l_contenido" cols="2" rows="2"></textarea>
            </div>

            <button class="btn btn-success" type="submit">Agregar</button>
          </form>
        </div>
      </div>

      <div class="card mb-3" style="display: none;">
        <div class="card-header">Actualizar lección</div>
        <div class="card-body">
          <form id="update_leccion_form">
            <?php echo insert_inputs(); ?>
            <input type="hidden" name="id" value="" required>

            <div class="mb-3">
              <label for="ul_titulo">Título</label>
              <input type="text" class="form-control" name="titulo" id="ul_titulo" required>
            </div>

            <div class="mb-3">
              <label for="ul_tipo">Tipo de lección</label>
              <select name="tipo" id="ul_tipo" class="form-select">
                <?php foreach (get_tipo_lecciones() as $tipo): ?>
                  <?php echo sprintf('<option value="%s">%s</option>', $tipo[0], $tipo[1]); ?>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="mb-3">
              <label for="ul_contenido">Contenido</label>
              <textarea class="form-control" name="contenido" id="ul_contenido" cols="2" rows="2"></textarea>
            </div>

            <button class="btn btn-success" type="submit">Guardar cambios</button>
            <button class="btn btn-danger cancelar_update_leccion" type="reset">Cancelar</button>
          </form>
        </div>
      </div>
    </div>

    <div class="col-lg-8">
      <div class="wrapper_lecciones" data-id="<?php echo $d->t->id; ?>">
        <!-- ajax loaded -->
      </div>
    </div>
  </div>
</div>

<?php require_once INCLUDES . 'footer.php'; ?>