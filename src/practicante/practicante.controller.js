'use strict'

import pool from "../../configs/db.js";

export const getPracticing = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const get = await conn.query(`SELECT 
                u.codeUser, 
                u.nameUser, 
                u.role,
                s.codeSupervisor,
                su.nameUser AS supervisorName, 
                sch.codeSchool,
                sch.nameSchool, 
                car.codeCareer,
                car.nameCareer,
                p.date_init, 
                p.date_finish, 
                p.practice_hrs, 
                p.codePracticing
            FROM Practicing p 
            JOIN Users u ON p.codeUser = u.codeUser
            JOIN Supervisor s ON p.codeSupervisor = s.codeSupervisor
            JOIN Users su ON s.codeUser = su.codeUser  
            JOIN School sch ON p.codeSchool = sch.codeSchool
            JOIN Career car ON p.codeCareer = car.codeCareer `)

        if( get.length === 0 ) return res.status(404).send({ message: 'Data is not defined'})
 
        return res.send({ get})
            
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally{
        conn.end()
    }
}

export const getUserPracticing = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const get = await conn.query(`SELECT * FROM Users WHERE role = 'Practicing'`)
        if(get.length === 0) return res.status(404).send({ message: 'Data is not found'})
        return res.send({ get })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally{
        conn.end()
    }
}

export const getPracticingByUser = async(req, res) =>{
    const conn = await pool.getConnection()
    try {
        const { id } = req.params
         
        
        const get = await conn.query(`SELECT * FROM Practicing WHERE codeUser = ?;`, id)
        const practicingId = get[0].codePracticing
        console.log(practicingId);
         
        return res.send({ get, practicingId })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally {
        conn.end()
    }
}

export const addPracticing = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        const { date_init, date_finish, practice_hrs, codeSupervisor, codeUser, codeSchool, codeCareer } = req.body;
        const existingPracticing = await conn.query(`SELECT * FROM Practicing WHERE codeUser = ?;`, codeUser)

        if(existingPracticing.length > 0) return res.status(400).send({ message: 'This practicing already exists'})
        
        BigInt.prototype.toJSON = function() { return this.toString()}

        const data = await conn.query(`INSERT INTO practicing (date_init, date_finish, practice_hrs, codeSupervisor, codeUser, codeSchool, codeCareer) VALUES (?,?,?,?,?,?,?);`, [date_init, date_finish, practice_hrs, codeSupervisor, codeUser, codeSchool, codeCareer])

        if(data == undefined) return res.status(404).send({ message: 'Data is not defined'})
        
        return res.send({ data})
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally {
        conn.end()
    }
}

export const updatePracticing = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const { id } = req.params;
        const { date_init, date_finish, practice_hrs, codeSupervisor, codeUser, codeSchool, codeCareer } = req.body;

        BigInt.prototype.toJSON = function() { return this.toString()}

        const data = await conn.query(`UPDATE practicing SET date_init = ?, date_finish = ?, practice_hrs = ?, codeSupervisor = ?, codeUser = ?, codeSchool = ?, codeCareer = ? WHERE codePracticing = ?`, [date_init, date_finish, practice_hrs, codeSupervisor, codeUser, codeSchool, codeCareer, id])

        return res.send({ data })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally{
        conn.end()
    }
}

export const getPracticBySuper = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        let { id } = req.params;

        /* Busque que supervisor es */
        let supervisor = await conn.query(`SELECT * FROM Supervisor WHERE codeUser = ?`, id)
        //console.log(supervisor);
        let idSupervisor = supervisor[0].codeSupervisor

        let practicings = await conn.query(`SELECT p.codePracticing, u.nameUser, u.codeUser
                                            FROM Practicing p
                                            JOIN Users u ON u.codeUser = p.codeUser
                                            WHERE codeSupervisor = ?`, idSupervisor)

        return res.send({ practicings })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally {
        conn.end()
    }
}