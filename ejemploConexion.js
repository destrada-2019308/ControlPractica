'use strict';

import pool from "../../configs/db";

// Ejemplo de uso de una conexión
const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Conexión exitosa:', conn);
    conn.release(); // Liberar la conexión al pool
  } catch (error) {
    console.error('Error al conectar:', error);
  }
};

testConnection(); // Llamar a la función para probar la conexión

// Función de prueba
export const test = (req, res) => {
  console.log('Test para la prueba');
  res.send('Test para la prueba');
};

// Obtener gestiones (Managments)
export const getManagments = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return res.status(500).send({ message: 'Error al conectar a la base de datos' });
    }

    const sql = 'SELECT * FROM managments';
    connection.query(sql, (err, results) => {
      connection.release(); // Liberar la conexión al pool

      if (err) {
        console.error('Error en la consulta SQL:', err);
        return res.status(500).send({ message: 'Error en la consulta SQL' });
      }

      if (!results.length) {
        return res.status(404).send({ message: 'No se encontraron datos' });
      }

      return res.send({ data: results });
    });
  });
};

// Añadir gestiones (Managments)
export const addManagments = (params) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return { message: 'Error al conectar a la base de datos' };
    }

    const sql = 'INSERT INTO managments SET ?';
    connection.query(sql, params, (err, results) => {
      connection.release(); // Liberar la conexión al pool

      if (err) {
        console.error('Error en la inserción:', err);
        return { message: 'Error en la inserción' };
      }

      console.log('Registro añadido:', results);
      return { message: 'Registro añadido', data: results };
    });
  });
};
