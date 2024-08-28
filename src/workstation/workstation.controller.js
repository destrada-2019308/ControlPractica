' use strict '

import pool from "../../configs/db.js"

 
export const getWorkstation = async (req, res) => {
    try {
        let get = await pool.query(`SELECT * FROM Workstation`) 

        if(get == undefined) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ get })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const addWorkstation = async (req, res) => {
    try {
        let { name, description } = req.body;

        const existingWorkstation = await pool.query('SELECT * FROM Workstation WHERE name = ?', name)

        if(existingWorkstation) return res.status(400).send({ message: 'This workstation alredy exists'})

        const data = await pool.query(`INSERT INTO Workstation (name, description ) VALUES (?,?);`,[name, description])

        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const updateWorkstation = async (req, res) => {
    try {
        let { id } = req.params;

        let { name, description } = req.body;

        let data = await pool.query(`UPDATE workstation SET name = ?, description = ? WHERE codeWorkstation = ?; `, [name, description, id])

        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}