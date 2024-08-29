import mariadb from 'mariadb'

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root'
})

export const initializeDatabase = async () => {
  let conn
  try {
    conn = await pool.getConnection()

    //await conn.query(`DROP DATABASE IF EXISTS controlPractica`) 
    await pool.query(`CREATE DATABASE IF NOT EXISTS practiceControl`)
    await conn.query(`USE practiceControl`)

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Users (
        codeUser INT AUTO_INCREMENT,
        name VARCHAR(125) NOT NULL,
        lastname VARCHAR(125) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(125) UNIQUE NOT NULL,
        phone VARCHAR(8) UNIQUE NOT NULL,
        password VARCHAR(256) NOT NULL,
        role ENUM('ADMIN', 'PRACTICING', 'SUPERVISOR', 'MANAGER') NOT NULL,
        state ENUM('ENABLE', 'DISABLED'),
        PRIMARY KEY PK_codeUser(codeUser)
      );
    `)

    await conn.query(`
        CREATE TABLE IF NOT EXISTS School(
          codeSchool INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(125),
          description VARCHAR(125),
          address VARCHAR(125),
          PRIMARY KEY PK_codeSchool(codeSchool)
        );
      `)

    await conn.query(`
        CREATE TABLE IF NOT EXISTS Career(
          codeCareer INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(125),
          description VARCHAR(125),
          PRIMARY KEY PK_codeCareer(codeCareer)
        );
      `)

      await conn.query(`
        CREATE TABLE IF NOT EXISTS Workstation(
          codeWorkstation INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(125),
          description VARCHAR(125),
          PRIMARY KEY PK_codeWorkstation(codeWorkstation)
        );
      `) 

      await conn.query(`
        CREATE TABLE IF NOT EXISTS Managments(
          codeManagments INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(125),
          description VARCHAR(125),
          PRIMARY KEY PK_codeManagments(codeManagments)
        );
      `) 

      await conn.query(`
        CREATE TABLE IF NOT EXISTS Supervisor(
          codeSupervisor INT NOT NULL AUTO_INCREMENT,
          codeUser INT NOT NULL,
          codeWkst INT NOT NULL,
          PRIMARY KEY PK_codeSupervisor(codeSupervisor),
          CONSTRAINT FK_Supervisor_Users FOREIGN KEY (codeUser)
            REFERENCES Users(codeUser)
        );
      `)

      await conn.query(`
        CREATE TABLE IF NOT EXISTS Manager(
          codeManager INT NOT NULL AUTO_INCREMENT,
          codeUser INT NOT NULL,
          codeManagments INT NOT NULL,
          PRIMARY KEY PK_codeManager(codeManager),
          CONSTRAINT FK_Manager_Users FOREIGN KEY (codeUser)
            REFERENCES Users(codeUser),
          CONSTRAINT FK_Manager_Managments FOREIGN KEY (codeManagments)
            REFERENCES Managments(codeManagments)
        );
      `)

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Practicing(
        codePracticing INT AUTO_INCREMENT,
        date_init DATE NOT NULL,
        date_finish DATE NOT NULL,
        practice_hrs TIME NOT NULL,
        codeSupervisor INT NOT NULL,
        codeUser INT NOT NULL,
        codeSchool INT NOT NULL,
        codeCareer INT NOT NULL,
        PRIMARY KEY PK_codePracticing(codePracticing),
        CONSTRAINT FK_Practicante_Users FOREIGN KEY(codeUser)
          REFERENCES Users(codeUser),
        CONSTRAINT FK_Practicante_School FOREIGN KEY(codeSchool)
          REFERENCES School(codeSchool),
        CONSTRAINT FK_Practicante_Career FOREIGN KEY(codeCareer)
          REFERENCES Career(codeCareer)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Control(
        codeControl  INT NOT NULL AUTO_INCREMENT,
        codePracticing INT NOT NULL,
        date DATE NOT NULL,
        hrs_mrn_entry TIME NOT NULL,
        hrs_mrn_exit TIME NOT NULL,
        hrs_aftn_entry TIME NOT NULL,
        hrs_aftn_exit TIME NOT NULL,
        description VARCHAR(125),
        evaluations ENUM('EXCELENTE', 'BUENO', 'REGULAR', 'MALO'),
        PRIMARY KEY PK_codeControl(codeControl),
        CONSTRAINT FK_Control_Practicing FOREIGN KEY(codePracticing)
          REFERENCES Practicing(codePracticing)
      );
    `);


    console.log("Base de datos y tablas creadas exitosamente.")
  } catch (err) {
    console.error("Error al crear la base de datos o tablas:", err)
  } finally {
    if (conn) conn.end()
  }
}
