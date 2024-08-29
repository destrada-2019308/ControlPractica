'use strict'

import pool from "../../configs/db.js";

export const addPracticing = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        let { codeUser, institucion, carrera, empresa, encargado } = req.body;
        console.log(codeUser, institucion, carrera, empresa, encargado);
        
        let result = await pool.query('INSERT INTO practicante (codeUser, institucion, carrera, empresa, encargado) VALUES (?,?,?,?,?)', [codeUser, institucion, carrera, empresa, encargado])
        BigInt.prototype.toJSON = function () { return this.toString() }
        console.log(result);
        
        if (!result) return res.status(404).send({ message: 'Faltan datos' })

        return res.send({ result })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally {
         conn.end();
    }
}

export const getManager = async (req, res) => {
    let conn = await pool.getConnection()
    try {

        const manager = await pool.query(`SELECT * FROM users where role = 'MANAGER'`)
        console.log(manager);
        if ( manager == undefined) return res.status(401).send({ message: 'que pedo?' })
        if (!manager) return res.status(401).send({ message: 'que pedo?' })
        return res.send({ manager })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally {
       conn.end();
    }
}

export const getPracticingById = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        let { id } = req.params;
        console.log('Id de params',id);
        
        let [practicing] = await pool.query(`select * from Practicante where codeUser = ?`, id)
        console.log(practicing);
        
        console.log(practicing == undefined);
        
        if(practicing == undefined){
            return res.status(404).send({ message: 'Data is not found'})
        }else{
            
            console.log('Practicing.codeUser: ',practicing.codeUser);
            console.log('dasddasdsadasdasd',practicing);
            
            console.log(practicing.codeUser);
            return res.send({ practicing })
        }

        

    } catch (error) {
        
        console.error(error);
        return res.status(500).send({ message: error })
    } finally {
        conn.end();
    }
}

