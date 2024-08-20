import mariadb from 'mariadb'

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 5
});

export const initializeDatabase = async() =>{
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Crear la base de datos si no existe
    await conn.query(`CREATE DATABASE IF NOT EXISTS controlPractica`);
    await conn.query(`USE controlPractica`);

    // Crear una tabla de ejemplo
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL
      )
    `);

    /*
    await conn.query(`
      CREATE TABLE IF NOT EXISTS control_practica (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        morning TIME NOT NULL, 
        afternoon TIME NOT NULL,
        description VARCHAR(150) ,
        assessment ENUM,

      )
    `);*/

    console.log("Base de datos y tablas creadas exitosamente.");
  } catch (err) {
    console.error("Error al crear la base de datos o tablas:", err);
  } finally {
    if (conn) conn.end();
  }
}
