'use strict'

import pool from "../../configs/db.js"

export const getSchool = async(req, res) =>{
    try {
        
        let get = await pool.query(`SELECT * FROM School;`)
        if(get == undefined) return res.status(404).send({message: 'Data is not found '})

        return res.send({ get })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const addSchool = async(req, res) =>{
    try {
        
        let { name, description, address } = req.body;
        
        const existingSchool = await pool.query(`SELECT * FROM School WHERE name = ?;` , name)
        if(existingSchool) return res.status(400).send({ message: 'This school alredy exists'})

        const data = await pool.query(`INSERT INTO school (name, description, address) VALUES (?,?,?) ;`, [name, description, address])

        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const updateSchool = async(req, res) =>{
    try {
        let { id } = req.params
        
        let { name, description, address } = req.body;
        
        let data = await pool.query(`UDPATE school SET name = ?, description = ?, address = ? WHERE codeSchool = ?`, [name, description, address, id])

        if(data == undefined) return res.status(404).send({ message: 'Data is not defined' })

        return res.send({ data })
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
        
    }
}