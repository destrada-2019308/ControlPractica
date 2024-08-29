'use strict'

import pool from "../../configs/db.js"


export const testConnection = async (req, res) => {
    
    const conn = await pool.getConnection()
    console.log('Conexion exitosa ', conn);
    conn.end()
    
}

export const getManagments = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const get = await conn.query('SELECT * FROM managments')

        if(get.length === 0) return res.status(404).send({ message: 'No hay datos'})

        return res.send({ get })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally{
        conn.end()
    }
}

export const addManagments = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { name, description } = req.body;

        const existingMana = await conn.query(`SELECT * FROM Managments WHERE name = ?`, name)
        BigInt.prototype.toJSON = function() {return this.toString()}

        if(existingMana.length > 0) return res.status(404).send({ message: 'This managments alredy exists'})

        const data = await conn.query( 'INSERT INTO managments (name, description) VALUES (?,?);', [name, description])

        return res.send({ message: 'Managments created successfully',data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end
    }
}

export const updateManagments = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { name, description } = req.body;
        const { id } = req.params;
        BigInt.prototype.toJSON = function() { return this.toString()}
        await conn.query('UPDATE managments SET name = ?, description = ? WHERE codeManagments = ?', [name, description, id])

        return res.send({ message: 'Managment updated successfully '})

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }finally{
        conn.end()
    }
}

