'use strict'

import pool from "../../configs/db.js"

export const getSupervisor = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [ data ] = await conn.query(`SELECT u.codeUser, u.name, u.role, 
                                            w.codeWorskstation, w.name, s.codeSupervisor  
                                            FROM supervisor s
                                            JOIN Users u ON s.codeUser = u.codeUser
                                            JOIN Workstation w ON w.codeWorkstation = s.codeWkst 
                                            WHERE u.role = 'SUPERVISOR'`)
        
        if(!data.length) return res.status(404).send({ message: 'Data is not found'})
        
        return res.send({ message: data})
        
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
        const data = { codeUser, codeWkst}

        await conn.query(`INSERT INTO supervisor SET ?`, data)

        return res.send({ message: 'Supervisor created successfully'})

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
        const { codeUser, codeWkst } = req.body
        const { id } = req.params
        const edit = { codeUser, codeWkst}
        await conn.query('UPDATE supervisor SET ? WHERE codeSupervisor = ? ',[ edit, id] )
        
        return res.send({ message: 'Supervisor updated successfully'})

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}