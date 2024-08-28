import pool from "../../configs/db.js";

let conn = await pool.getConnection()

export const getData = async(req, res) =>{
    let conn = await pool.getConnection()
    try {
        
        
        const data = await conn.query('SELECT * FROM practicControl')

        //console.log(data);
        
        if(!data) return res.status(404).send({ message: 'Data is no found'})

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return error
    }finally {
        if (conn) return conn.end();
      }
}

export const createControl = async(req, res) =>{
    let conn = await pool.getConnection()
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

        return res.send({ result })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    }finally {
        if (conn) return conn.end();
      }
}

export const getControlByUser = async(req, res) =>{
    
    try {
        let { id } = req.params;
        console.log(id);
        
        
        if(id == undefined) return res.status(404).send({message: 'Es undefined'})
        
        let data = await conn.query(` select codePracticControl, 
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
        
        
        
        if(data == []) return res.status(404).send({ message: 'No hay data' })


        data = data.map(row => ({
            ...row,
            date: row.date ? row.date.toISOString().split('T')[0] : null
        }));

    
        //console.log(data[0].date);

        return res.send({ data })

    } catch (error) {
        throw err;
    }finally {
        if (conn) return conn.end();
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
                   p.codePracticante, p.institucion, p.carrera, p.empresa, 
                   pc.codePracticControl, pc.date, pc.hour_morning_entry, pc.hour_morning_exit, 
                   pc.hour_afternoon_entry, pc.hour_afternoon_exit, 
                   pc.description, pc.evaluations
            FROM PracticControl pc
            JOIN Practicante p ON pc.codePracticante = p.codePracticante
            JOIN Users u ON p.codeUser = u.codeUser
            WHERE pc.codePracticante = ?
            AND pc.codePracticControl = ?
        `, [codePracticante, codePracticControl]);


        

        BigInt.prototype.toJSON =  function() { return this.toString()}

        return res.send({ data, result })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    }
}

export const allData = async(req, res) =>{
     try {
        const { id } = req.params
        const data = await pool.query(`
            SELECT u.codeUser, u.name, u.username, u.email, u.phone, u.role, u.estado, 
                   p.codePracticante, p.institucion, p.carrera, p.empresa, p.encargado,
                   pc.codePracticControl, pc.date, pc.hour_morning_entry, pc.hour_morning_exit, 
                   pc.hour_afternoon_entry, pc.hour_afternoon_exit, 
                   pc.description, pc.evaluations
            FROM PracticControl pc
            JOIN Practicante p ON pc.codePracticante = p.codePracticante
            JOIN Users u ON p.codeUser = u.codeUser where p.encargado = ?;`, id)
        
        console.log(data);
        

        if(!data) return res.status(404).send({ message: 'No hay data' })

        return res.send({ data })
     } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
     }
}
     
