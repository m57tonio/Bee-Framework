<?php
/**
 * Plantilla general de modelos
 * @version 1.2.0
 *
 * Modelo de leccion
 */
class leccionModel extends Model {
  /**
  * Nombre de la tabla
  */
  public static $t1 = 'lecciones';

  // Esquema del Modelo
  

  function __construct()
  {
    // Constructor general
  }

  static function all() 
  {
    // Todos los registros
    $sql = 'SELECT * FROM lecciones ORDER BY id DESC';
    return ($rows = parent::query($sql)) ? $rows : [];
  }

  static function by_id($id)
  {
    // Un registro con $id
    $sql = 'SELECT * FROM lecciones WHERE id = :id LIMIT 1';
    return ($rows = parent::query($sql, ['id' => $id])) ? $rows[0] : [];
  }

  static function by_temario($id_temario)
  {
    $sql = 'SELECT * FROM lecciones WHERE id_temario = :id_temario ORDER BY orden ASC';
    return ($rows = parent::query($sql, ['id_temario' => $id_temario])) ? $rows : [];
  }
}

