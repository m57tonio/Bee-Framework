<?php
/**
 * Plantilla general de modelos
 * @version 1.2.0
 *
 * Modelo de temario
 */
class temarioModel extends Model {
  /**
  * Nombre de la tabla
  */
  public static $t1 = 'temarios';
  // Esquema del Modelo
  
  function __construct()
  {
    // Constructor general
  }

  static function insertOne(array $data)
  {
    return parent::add(self::$t1, $data);
  }
  
   static function all() {
    // Todos los registros
    $sql = 'SELECT * FROM temarios ORDER BY id DESC';
    return ($rows = parent::query($sql)) ? $rows : [];
  }

  static function all_paginated() {
    // Todos los registros
    $sql = 'SELECT t.*,
    (SELECT COUNT(l.id) FROM lecciones l WHERE l.id_temario = t.id) AS total_lecciones
    FROM temarios t
    ORDER BY t.id DESC';
    return PaginationHandler::paginate($sql);
  }

  static function by_id($id)
  {
    // Un registro con $id
    $sql  = 'SELECT * FROM temarios WHERE id = :id LIMIT 1';
    $rows = parent::query($sql, ['id' => $id]);

    if (!$rows) return [];

    // Si si existe el registro cargar las lecciones disponibles
    $rows = $rows[0];
    $rows['lecciones'] = leccionModel::by_temario($id);

    return $rows;
  }
}

