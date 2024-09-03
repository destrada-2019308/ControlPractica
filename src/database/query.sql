CREATE DATABASE IF NOT EXISTS practiceControl;

USE practiceControl;

CREATE TABLE IF NOT EXISTS Users (
    codeUser INT AUTO_INCREMENT,
    nameUser VARCHAR(125) NOT NULL,
    lastname VARCHAR(125) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(125) UNIQUE NOT NULL,
    phone VARCHAR(8) UNIQUE NOT NULL,
    password VARCHAR(256) NOT NULL,
    role ENUM('ADMIN', 'PRACTICING', 'SUPERVISOR', 'MANAGER') NOT NULL,
    state ENUM('ENABLE', 'DISABLED'),
    PRIMARY KEY PK_codeUser(codeUser)
);

CREATE TABLE IF NOT EXISTS School(
    codeSchool INT NOT NULL AUTO_INCREMENT,
    nameSchool VARCHAR(125),
    descriptionSchool VARCHAR(125),
    addressSchool VARCHAR(125),
    PRIMARY KEY PK_codeSchool(codeSchool)
);

CREATE TABLE IF NOT EXISTS Career(
    codeCareer INT NOT NULL AUTO_INCREMENT,
    nameCareer VARCHAR(125),
    descriptionCareer VARCHAR(125),
    PRIMARY KEY PK_codeCareer(codeCareer)
);

CREATE TABLE IF NOT EXISTS Workstation(
    codeWorkstation INT NOT NULL AUTO_INCREMENT,
    nameWorkstation VARCHAR(125),
    descriptionWorkstation VARCHAR(125),
    PRIMARY KEY PK_codeWorkstation(codeWorkstation)
);

CREATE TABLE IF NOT EXISTS Managments(
    codeManagments INT NOT NULL AUTO_INCREMENT,
    nameManagments VARCHAR(125),
    descriptionManagments VARCHAR(125),
    codeWorkstation INT NOT NULL,
    PRIMARY KEY PK_codeManagments(codeManagments),
    CONSTRAINT FK_Managments_Workstation FOREIGN KEY (codeWorkstation)
        REFERENCES Workstation(codeWorkstation)
);

CREATE TABLE IF NOT EXISTS Supervisor(
    codeSupervisor INT NOT NULL AUTO_INCREMENT,
    codeUser INT NOT NULL,
    codeWkst INT NOT NULL,
    PRIMARY KEY PK_codeSupervisor(codeSupervisor),
    CONSTRAINT FK_Supervisor_Users FOREIGN KEY (codeUser) REFERENCES Users(codeUser)
);

CREATE TABLE IF NOT EXISTS Manager(
    codeManager INT NOT NULL AUTO_INCREMENT,
    codeUser INT NOT NULL,
    codeManagments INT NOT NULL,
    PRIMARY KEY PK_codeManager(codeManager),
    CONSTRAINT FK_Manager_Users FOREIGN KEY (codeUser) REFERENCES Users(codeUser),
    CONSTRAINT FK_Manager_Managments FOREIGN KEY (codeManagments) REFERENCES Managments(codeManagments)
);

CREATE TABLE IF NOT EXISTS Practicing(
    codePracticing INT AUTO_INCREMENT,
    date_init DATE NOT NULL,
    date_finish DATE NOT NULL,
    practice_hrs DECIMAL NOT NULL,
    codeSupervisor INT NOT NULL,
    codeUser INT NOT NULL,
    codeSchool INT NOT NULL,
    codeCareer INT NOT NULL,
    PRIMARY KEY PK_codePracticing(codePracticing),
    CONSTRAINT FK_Practicing_Supervisor FOREIGN KEY(codeSupervisor)
        REFERENCES Supervisor(codeSupervisor),
    CONSTRAINT FK_Practicante_Users FOREIGN KEY(codeUser) 
        REFERENCES Users(codeUser),
    CONSTRAINT FK_Practicante_School FOREIGN KEY(codeSchool) 
        REFERENCES School(codeSchool),
    CONSTRAINT FK_Practicante_Career FOREIGN KEY(codeCareer) 
        REFERENCES Career(codeCareer)
);

CREATE TABLE IF NOT EXISTS Control(
    codeControl INT NOT NULL AUTO_INCREMENT,
    codePracticing INT NOT NULL,
    date DATE NOT NULL,
    hrs_mrn_entry TIME,
    hrs_mrn_exit TIME,
    hrs_aftn_entry TIME,
    hrs_aftn_exit TIME,
    description VARCHAR(625),
    evaluations ENUM('EXCELENTE', 'BUENO', 'REGULAR', 'MALO', 'NULL'),
    PRIMARY KEY PK_codeControl(codeControl),
    CONSTRAINT FK_Control_Practicing FOREIGN KEY(codePracticing) REFERENCES Practicing(codePracticing)
);