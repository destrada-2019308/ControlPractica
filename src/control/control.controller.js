import pool from "../../configs/db.js";

export const getData = async(req, res) =>{
    try {
        let conn = await pool.getConnection()
        
        const data = await conn.query('SELECT * FROM practicControl')

        //console.log(data);
        
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
        //console.log(codePracticante);
        
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
        
        //console.log('id', id);

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
        
        //console.log('asdasdasd',data);

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

export const getControlManaClient = async(req, res) =>{
    try {
        let { id } = req.params;
        //console.log(id);
        
        const data = await pool.query(`SELECT * FROM practicante where encargado = ?`, id)
        //console.log(data);

        
        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const evaluation = async(req, res) =>{
    try {
        const {evaluations, codePracticante, codePracticControl} = req.body;
        //console.log(evaluations, codePracticante, codePracticControl);
        
        
        const data = await pool.query('UPDATE practicControl SET evaluations = ? where codePracticante = ? AND codePracticControl =?', [ evaluations, codePracticante, codePracticControl])
        const result = await pool.query(`
            SELECT u.name, u.username, u.email, u.phone, u.role, u.estado, 
                   p.institucion, p.carrera, p.empresa, 
                   pc.date, pc.hour_morning_entry, pc.hour_morning_exit, 
                   pc.hour_afternoon_entry, pc.hour_afternoon_exit, 
                   pc.description, pc.evaluations
            FROM PracticControl pc
            JOIN Practicante p ON pc.codePracticante = p.codePracticante
            JOIN Users u ON p.codeUser = u.codeUser
            WHERE pc.codePracticante = ?
            AND pc.codePracticControl = ?
        `, [codePracticante, codePracticControl]);
        BigInt.prototype.toJSON = function() { return this.toString()}

        return res.send({ data, result })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}


     
