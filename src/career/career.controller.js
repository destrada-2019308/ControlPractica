'use strict '

import pool from "../../configs/db.js"

export const getCareer = async (req, res) => {
    try {
        let get = await pool.query(`SELECT * FROM career;`)

        if(get == undefined) return res.status(404).send({ message: 'Data is not defined'})

        return res.send({ get })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const addCareer = async (req, res) => {
    try {
        let { name, description } = req.body;
        const existingCareer = await pool.query(`SELECT * FROM Career WHERE name = ?`, name)
    
        if(existingCareer) return res.status(404).send({ message: 'This career alredy exists' })

        const data = await pool.query(`INSERT INTO career (name, description) VALUES (?;?) ;`, [name, description])

        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})
            
        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const updateCareer = async (req, res) => {
    try {
        let { id } = req.params;

        let { name, description } = req.body

        let data = await pool.query(`UPDATE career SET name = ? , description = ?; WHERE codeCareer = ?;`, [name, description, id])

        if(data == undefined) return res.status(404).send({ message: 'Data is not definded'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}