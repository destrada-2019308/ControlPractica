' use strict '

import pool from "../../configs/db.js"

 
export const getWorkstation = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let get = await conn.query(`SELECT * FROM Workstation`) 

        if(get.length === 0) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ get })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}

export const addWorkstation = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { nameWorkstation, descriptionWorkstation } = req.body;
        console.log(nameWorkstation, descriptionWorkstation);
        
        
        const existingWorkstation = await conn.query('SELECT * FROM Workstation WHERE nameWorkstation = ?;', nameWorkstation)
        BigInt.prototype.toJSON = function() { return this.toString()}
        if(existingWorkstation.length > 0) return res.status(400).send({ message: 'This workstation alredy exists'})

        const data = await conn.query(`INSERT INTO Workstation (nameWorkstation, descriptionWorkstation ) VALUES (?,?);`,[nameWorkstation, descriptionWorkstation])
        console.log(data);
        
        if(data == undefined) return res.status(404).send({ message: 'No hay datos'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }finally{
        conn.end()
    }
}

export const updateWorkstation = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { id } = req.params;

        let { nameWorkstation, descriptionWorkstation } = req.body;

        let data = await conn.query(`UPDATE workstation SET nameWorkstation = ?, descriptionWorkstation = ? WHERE codeWorkstation = ?; `, [nameWorkstation, descriptionWorkstation, id])
        BigInt.prototype.toJSON = function() { return this.toString()}
        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}