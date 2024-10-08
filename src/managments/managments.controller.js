'use strict'

import pool from "../../configs/db.js"


export const testConnection = async (req, res) => {
    
    const conn = await pool.getConnection()
    console.log('Conexion exitosa ', conn);
    conn.release()
    
}

export const getManagments = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const get = await conn.query(`SELECT m.codeManagments, m.nameManagments, m.descriptionManagments,
                                            w.codeWorkstation, w.nameWorkstation
                                         FROM managments m
                                         JOIN Workstation w ON m.codeWorkstation = w.codeWorkstation`)

        //if(get.length === 0) return res.status(404).send({ message: 'No hay datos'})

        return res.send({ get })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally{
        conn.release()
    }
}

export const addManagments = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { nameManagments, descriptionManagments, codeWorkstation } = req.body;

        const existingMana = await conn.query(`SELECT * FROM Managments WHERE nameManagments = ?`, nameManagments)
        BigInt.prototype.toJSON = function() {return this.toString()}

        if(existingMana.length > 0) return res.status(404).send({ message: 'This managments alredy exists'})

        const data = await conn.query( 'INSERT INTO managments (nameManagments, descriptionManagments, codeWorkstation) VALUES (?,?,?);', [nameManagments, descriptionManagments, codeWorkstation])

        return res.send({ message: 'Managments created successfully',data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.release()
    }
}

export const updateManagments = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { nameManagments, descriptionManagments } = req.body;
        const { id } = req.params;
        BigInt.prototype.toJSON = function() { return this.toString()}
        await conn.query('UPDATE managments SET nameManagments = ?, descriptionManagments = ? WHERE codeManagments = ?', [nameManagments, descriptionManagments, id])

        return res.send({ message: 'Managment updated successfully '})

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }finally{
        conn.release()
    }
}

