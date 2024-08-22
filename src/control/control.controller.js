import pool from "../../configs/db.js";

export const getData = async(req, res) =>{
    try {
        let conn = await pool.getConnection()
        
        const data = await conn.query('SELECT * FROM practicControl')

        if(!data) return res.status(404).send({ message: 'Data is no found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return error
    }
}

export const createControl = async(req, res) =>{
    try {
        const { date, hour_morning_entry, hour_morning_exit, hour_afternoon_entry, hour_afternoon_exit, description, codeUser, encargado } = req.body;
        const evaluations = '0'
        const result = await pool.query("INSERT INTO practicControl (date, hour_morning_entry, hour_morning_exit, hour_afternoon_entry, hour_afternoon_exit, description, evaluations, codeUser, encargado) VALUES (?,?,?,?,?,?,?,?,?)", [date, hour_morning_entry, hour_morning_exit, hour_afternoon_entry, hour_afternoon_exit, description, evaluations, codeUser, encargado] )

        BigInt.prototype.toJSON = function() { return this.toString()}

        res.send({ result })

    } catch (error) {
        console.error(error);
        return error
    }
}

export const getControlByUser = async(req, res) =>{
    try {
        let { id } = req.params;

        console.log(id);

        const data = await pool.query(` select codePracticControl, date, hour_morning_entry, hour_morning_exit, hour_afternoon_entry, hour_afternoon_exit, description, evaluations, codeUser from practicControl where codeUser = ${id}; `)
        const user = await pool.query(` SELECT * FROM users WHERE codeUser = ${id}`)
        
        console.log(user);
        console.log(data[0].date);
        
        
        return res.send({ data, user })

    } catch (error) {
        console.error(error);
        return error
    }
}

/*

---------------------------------------------------------------------------
UPDATE AND DELETE

*/