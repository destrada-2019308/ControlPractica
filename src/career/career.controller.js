'use strict '

import pool from "../../configs/db.js"

export const getCareer = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let get = await conn.query(`SELECT * FROM career;`)

        if(get.length === 0) return res.status(404).send({ message: 'Data is not defined'})

        return res.send({ get })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }finally{
        conn.end()
    }
}

export const addCareer = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { nameCareer, descriptionCareer } = req.body;
        const existingCareer = await conn.query(`SELECT * FROM Career WHERE nameCareer = ?;`, nameCareer)
        BigInt.prototype.toJSON = function() { return this.toString()}
        if(existingCareer.length > 0) return res.status(404).send({ message: 'This career alredy exists' })

        const data = await conn.query(`INSERT INTO career (nameCareer, descriptionCareer) VALUES (?,?) ;`, [nameCareer, descriptionCareer])

        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})
            
        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }finally{
        conn.end()
    }
}

export const updateCareer = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { id } = req.params;

        let { nameCareer, descriptionCareer } = req.body
        BigInt.prototype.toJSON = function() { return this.toString()}
        let data = await conn.query(`UPDATE career SET nameCareer = ? , descriptionCareer = ? WHERE codeCareer = ?;`, [nameCareer, descriptionCareer, id])

        if(data == undefined) return res.status(404).send({ message: 'Data is not definded'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally{
        conn.end()
    }
}