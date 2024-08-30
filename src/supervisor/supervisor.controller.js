'use strict'

import pool from "../../configs/db.js"

export const getUserSupervisor = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const get = await conn.query(`SELECT * FROM users WHERE state = 'ENABLE' AND role = 'SUPERVISOR';`)
        
        if(get.length === 0) return res.status(404).send({ message: 'Data is not found'})
        
        return res.send({  get })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}

export const getSupervisor = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const get = await conn.query(`SELECT u.codeUser, u.nameUser, u.role, 
                                            w.codeWorkstation, w.nameWorkstation, s.codeSupervisor  
                                            FROM supervisor s
                                            JOIN Users u ON s.codeUser = u.codeUser
                                            JOIN Workstation w ON w.codeWorkstation = s.codeWkst`)
        
        if(get.length === 0) return res.status(404).send({ message: 'Data is not found'})
        
        return res.send({ message: get, get})
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}

export const addSupervisor = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { codeUser, codeWkst } = req.body;
        console.log(codeUser, codeWkst);
        
        const existingSupervisor = await conn.query(`SELECT * FROM Supervisor WHERE codeUser = ?;`, codeUser)

        if(existingSupervisor.length > 0) return res.status(400).send({ message: 'This supervisor alredy exists'})

        BigInt.prototype.toJSON = function() { return this.toString()}

        const data = await conn.query(`INSERT INTO supervisor (codeUser, codeWkst) VALUES (?,?);`, [codeUser, codeWkst])

        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}

export const updateSupervisor = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id } = req.params
        const { codeUser, codeWkst } = req.body;
        
        
        BigInt.prototype.toJSON = function() { return this.toString()}

        const data = await conn.query('UPDATE supervisor SET codeUser = ?, codeWkst = ? WHERE codeSupervisor = ?; ',[ codeUser, codeWkst, id] )
        
        if(data == undefined) return res.status(404).send({ message : 'Data is not found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}