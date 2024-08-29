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
        let { name, description } = req.body;
        console.log(name, description);
        
        
        const existingWorkstation = await conn.query('SELECT * FROM Workstation WHERE name = ?;', name)
        BigInt.prototype.toJSON = function() { return this.toString()}
        if(existingWorkstation.length > 0) return res.status(400).send({ message: 'This workstation alredy exists'})

        const data = await conn.query(`INSERT INTO Workstation (name, description ) VALUES (?,?);`,[name, description])
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

        let { name, description } = req.body;

        let data = await conn.query(`UPDATE workstation SET name = ?, description = ? WHERE codeWorkstation = ?; `, [name, description, id])
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