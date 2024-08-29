'use strict'

import pool from "../../configs/db.js"

export const getSchool = async(req, res) =>{
    let conn = await pool.getConnection()
    try {
        
        console.log(conn);
        
        let get = await conn.query(`SELECT * FROM School;`)

        
        if(get.length === 0) return res.status(404).send({message: 'Data is not found '})

        return res.send({ get })
    } catch (error) {
        throw error;
    }finally{
        conn.end()
    }
}

export const addSchool = async(req, res) =>{
    let conn = await pool.getConnection()
    try {
        
        let { name, description, address } = req.body;
        console.log(name, description, address);
        
        const existingSchool = await conn.query(`SELECT * FROM School WHERE name = ?;` , name)
        BigInt.prototype.toJSON = function() { return this.toString()}
        console.log(existingSchool);
        if (existingSchool.length > 0) return res.status(400).send({ message: 'This school already exists' });
        
        
        const data = await conn.query(`INSERT INTO school (name, description, address) VALUES (?,?,?) ;`, [name, description, address])

        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }finally{
        conn.end()
    }
}

export const updateSchool = async(req, res) =>{
    const conn = await pool.getConnection();
    try {
        let { id } = req.params
        console.log(id);
        
        if(id === undefined) return res.status(404).send({ message: 'Id is not defined'})
        let { name, description, address } = req.body;
        BigInt.prototype.toJSON = function() { return this.toString()}
        let data = await conn.query(`UPDATE school SET name = ?, description = ?, address = ? WHERE codeSchool = ?`, [name, description, address, id])

        if(data == undefined) return res.status(404).send({ message: 'Data is not defined' })

        return res.send({ data })
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }finally{
        conn.end()
    }
}