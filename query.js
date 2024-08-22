import mariadb from 'mariadb'

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 5
}) 

export const initializeDatabase = async() =>{
  let conn 
  try {
    conn = await pool.getConnection() 
    
    //await conn.query(`DROP DATABASE IF EXISTS controlPractica`) 
    await conn.query(`CREATE DATABASE IF NOT EXISTS controlPractica`) 
    await conn.query(`USE controlPractica`) 

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Users (
        codeUser INT AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(8) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL,
        PRIMARY KEY PK_codeUser(codeUser)
      );
    `)

    await conn.query(`
      CREATE TABLE IF NOT EXISTS PracticControl(
          codePracticControl INT NOT NULL AUTO_INCREMENT,
          date DATE NOT NULL,
          morning TIME NOT NULL,
          afternoon TIME NOT NULL,
          description VARCHAR (100) NOT NULL,
          evaluations CHAR(1) NOT NULL,
          codeUser int not null,
          PRIMARY KEY PK_codePracticControl(codePracticControl),
          CONSTRAINT FK_PracticControl_Users FOREIGN KEY(codeUser)
            REFERENCES Users(codeUser)
        );
      `)

    console.log("Base de datos y tablas creadas exitosamente.") 
  } catch (err) {
    console.error("Error al crear la base de datos o tablas:", err) 
  } finally {
    if (conn) conn.end() 
  }
}
