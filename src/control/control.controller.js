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
        const { date, morning, afternoon, description, evaluations, codeUser } = req.body;

        const result = await pool.query("INSERT INTO practicControl (date, morning, afternoon, description, evaluations, codeUser) VALUES (?,?,?,?,?,?)", [date, morning, afternoon, description, evaluations, codeUser] )

        BigInt.prototype.toJson = function() { return this.toString()}

        res.json ({ result })

    } catch (error) {
        console.error(error);
        return error
    }
}

export const getControlByUser = async(req, res) =>{
    try {
        let { id } = req.params;

        console.log(id);

        const data = await pool.query('SELECT * FROM practicControl WHERE codeUser = ? ', [id])

        return res.json({ data })

    } catch (error) {
        console.error(error);
        return error
    }
}

/*

---------------------------------------------------------------------------
UPDATE AND DELETE

*/