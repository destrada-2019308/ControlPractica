import pool from "../../configs/db.js";

export const getData = async(req, res) =>{
    try {
        let conn = await pool.getConnection()
        
        const data = await conn.query('SELECT * FROM practicControl')

        console.log(data);
        
        if(!data) return res.status(404).send({ message: 'Data is no found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return error
    }
}

export const createControl = async(req, res) =>{
    try {
        const { date, hour_morning_entry, hour_morning_exit, hour_afternoon_entry, hour_afternoon_exit, description, codePracticante } = req.body;
        const evaluations = '0'
        console.log(codePracticante);
        
        const result = await pool.query(`INSERT INTO practicControl (date, 
                                                            hour_morning_entry, 
                                                            hour_morning_exit, 
                                                            hour_afternoon_entry, 
                                                            hour_afternoon_exit, 
                                                            description, 
                                                            evaluations, 
                                                            codePracticante) 
                                                            VALUES (?,?,?,?,?,?,?,?)`, 
                                                            [date, hour_morning_entry, hour_morning_exit, hour_afternoon_entry, hour_afternoon_exit, description, evaluations, codePracticante] )

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
        
        console.log('id', id);

        //Consulta usando parametros preparados para evitar inyeccion sql
        let data = await pool.query(` select codePracticControl, 
                                        DATE(date) as date, 
                                        hour_morning_entry, 
                                        hour_morning_exit, 
                                        hour_afternoon_entry, 
                                        hour_afternoon_exit, 
                                        description, 
                                        evaluations, 
                                        codePracticante 
                                        from practicControl 
                                        where codePracticante = ?; `, [id])
        
        console.log('asdasdasd',data);

        //let user = await pool.query(` SELECT * FROM users WHERE codeUser = ?`, data.codePracticante)
        
        
       
        //console.log(user);
        //console.log(data[0].date);
        
        if(data == []) return res.status(404).send({ message: 'No hay data' })

        data = data.map(row => ({
            ...row,
            date: row.date ? row.date.toISOString().split('T')[0] : null
        }));

    
        //console.log(data[0].date);

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return error
    }
}

export const evaluation = async(req, res) =>{
    try {
        const {evaluations, codePracticante} = req.body;
        console.log(evaluations, codePracticante);
        
        const data = await pool.query('UPDATE practicControl SET evaluations = ? where codePracticante = ?', [ evaluations, codePracticante])

        BigInt.prototype.toJSON = function() { return this.toString()}

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}