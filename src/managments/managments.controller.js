'use strict'

import pool from "../../configs/db"


export const testConnection = async (req, res) => {
    
    const conn = await pool.getConnection()
    console.log('Conexion exitosa ', conn);
    conn.release()
    
}

export const getManagments = async (req, res) => {
    try {
        const conn = await pool.getConnection() 
        let get = await pool.query(`SELECT * FORM managments`)

        if(get == undefined ) return res.status(404).send({ message: 'Data is not defined'})

        return res.send({ get })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const addManagments = async (params) => {
    
}