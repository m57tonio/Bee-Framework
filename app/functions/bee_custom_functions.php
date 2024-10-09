<?php
// Funciones directamente del proyecto en curso

/**
 * Ejemplo para agregar endpoints autorizados para la API
 * Esto sólo es necesario si usarás más controladores a parte de apiController como endpoints de API
 * De lo contrario no requieres anexarlos a la lista de endpoints
 */
BeeHookManager::registerHook('init_set_up', 'setUpRoutes');

function setUpRoutes(Bee $instance)
{
  // Prueba ingresando a esta URL (depende de tu ubicación del proyecto): http://localhost:8848/Bee-Framework/reportes
  $instance->addEndpoint('reportes');
  $instance->addEndpoint('citas');
  $instance->addEndpoint('sucursales');

  $instance->addAjax('ajax2'); // http://localhost:8848/Bee-Framework/ajax2
}

function decideTextColor($backgroundColor)
{
  // Convertir el color de fondo de hexadecimal a RGB
  list($r, $g, $b) = sscanf($backgroundColor, "#%02x%02x%02x");

  // Calcular luminancia relativa del color de fondo
  $luminance = 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;

  // Determinar el contraste mínimo requerido para colores claros y oscuros
  $minContrastForLightColor = 1.5; // Umbral para colores claros
  $minContrastForDarkColor  = 3.0;  // Umbral para colores oscuros

  // Calcular el contraste entre el color de fondo y el color blanco y negro
  $contrastWithWhite = (255 + 0.05) / ($luminance + 0.05);
  $contrastWithBlack = ($luminance + 0.05) / 0.05;

  // Determinar el color de texto basado en los umbrales de contraste
  if ($contrastWithWhite >= $minContrastForLightColor && $contrastWithBlack >= $minContrastForDarkColor) {
    return "#FFFFFF"; // Blanco para colores claros y oscuros
  } elseif ($contrastWithWhite >= $minContrastForLightColor) {
    return "#FFFFFF"; // Blanco para colores claros
  } else {
    return "#000000"; // Negro para colores oscuros
  }
}

function get_temario_estados()
{
  return
  [
    ['borrador', 'Borrador'],
    ['realizado', 'Realizado']
  ];
}

function format_temario_estado($estado)
{
  $text        = '';
  $classes     = '';
  $icon        = '';
  $placeholder = '<span class="%s"><i class="%s"></i> %s</span>';

  switch ($estado) {
    case 'borrador':
      $text    = 'Borrador';
      $classes = 'badge bg-warning text-dark';
      $icon    = 'fas fa-eraser';
      break;
    case 'realizado':
      $text    = 'Realizado';
      $classes = 'badge bg-success';
      $icon    = 'fas fa-check';
      break;
    default:
      $text    = 'Desconocido';
      $classes = 'badge bg-danger';
      $icon    = 'fas fa-question-circle';
  }

  return sprintf($placeholder, $classes, $icon, $text);
}

function get_tipo_lecciones()
{
  return
  [
    ['texto'          , 'Texto'],
    ['video'          , 'Video'],
    ['descarga'       , 'Descarga'],
    ['recurso_externo', 'Recurso Externo']
  ];
}

function format_tipo_leccion($tipo_leccion)
{
  $placeholder = '<i class="%s"></i>';
  $icon        = '';

  switch ($tipo_leccion) {
    case 'texto':
      $icon = 'fas fa-file-alt';
      break;

    case 'video':
      $icon = 'fas fa-video';
      break;

    case 'descarga':
      $icon = 'fas fa-download';
      break;

    case 'recurso_externo':
      $icon = 'fas fa-external-link-alt';
      break;
    
    default:
      $icon = 'fas fa-question-circle';
      break;
  }

  return sprintf($placeholder, $icon);
}

function check_temario_status($id_temario)
{
  if (!$temario = temarioModel::by_id($id_temario)) return false;

  // Validar lecciones
  if (empty($temario['lecciones'])) {
    temarioModel::update(temarioModel::$t1, ['id' => $id_temario], ['status' => 'borrador']);

    return true;
  }

  // Iterar todas las lecciones
  $lecciones       = $temario['lecciones'];
  $status          = $temario['status']; // borrador o realizado
  $total_lecciones = count($lecciones);
  $listas          = 0;
  $pendientes      = 0;

  foreach ($lecciones as $l) {
    if ($l['status'] === 'pendiente') {
      $pendientes++;
    } else {
      $listas++;
    }
  }

  // Actualizando el status del temario
  if ($total_lecciones == $listas && $status === 'borrador') {
    temarioModel::update(temarioModel::$t1, ['id' => $id_temario], ['status' => 'realizado']);
  } else if ($total_lecciones != $listas && $status === 'realizado') {
    temarioModel::update(temarioModel::$t1, ['id' => $id_temario], ['status' => 'borrador']);
  }

  return true;
}