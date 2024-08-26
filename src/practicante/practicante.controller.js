'use strict'

import pool from "../../configs/db.js";

export const addPracticing = async(req, res) =>{
    try {
        let { codeUser, institucion, carrera, empresa, encargado } = req.body;

        let result = await pool.query('INSERT INTO practicante (codeUser, institucion, carrera, empresa, encargado) VALUES (?,?,?,?,?)', [codeUser, institucion, carrera, empresa, encargado])
        BigInt.prototype.toJSON = function() { return this.toString() }
        
        return res.send({ result })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const getManager = async(req, res) =>{
    try {

        const manager = await pool.query(`SELECT * FROM users where role = 'MANAGER'`)
        console.log(manager);
        
        if(!manager) return res.status(401).send({message: 'que pedo?'})
        return res.send({ manager })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error }) 
    }
}

export const getPracticingById = async(req, res) =>{
    try {
        let {id} = req.params;

        console.log('Id Practicante',id);
        
        let [practicing] = await pool.query(`select * from Practicante where codeUser = ?`, [id])

        console.log(practicing.codeUser);
        

        return res.send({ practicing })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

