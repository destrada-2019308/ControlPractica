import pool from "../../configs/db.js";

/* Buscqueda de control por practicante */
export const getControl = async (req, res) => {
    let conn = await pool.getConnection()

    try {

        let { id } = req.params;
         
        const get = await conn.query('SELECT * FROM control WHERE codePracticing = ?', id)

        if (get.length === 0) return res.status(404).send({ message: 'Data is no found' })

        return res.send({ get })
        
    } catch (error) {
        console.error(error);
        return error
    } finally {
        conn.end();
    }
}
/* Todos los datos de un practicante */

export const getAllData = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        let { id } = req.params;
        const get = await conn.query(`
            SELECT 
                u.codeUser, 
                u.nameUser, 
                u.role,
                s.codeSupervisor,
                su.nameUser AS supervisorName, 
                sch.codeSchool,
                sch.nameSchool, 
                car.codeCareer,
                car.nameCareer,
                p.date_init, 
                p.date_finish, 
                p.practice_hrs, 
                p.codePracticing
            FROM Practicing p 
            JOIN Users u ON p.codeUser = u.codeUser
            JOIN Supervisor s ON p.codeSupervisor = s.codeSupervisor
            JOIN Users su ON s.codeUser = su.codeUser  
            JOIN School sch ON p.codeSchool = sch.codeSchool
            JOIN Career car ON p.codeCareer = car.codeCareer WHERE codePracticing = ?`, id)
  
        

        if (get.length === 0) return res.status(404).send({ message: 'Data is no found' })

        return res.send({ get })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: error })
    } finally {
        conn.end()
    }
}

export const addControl = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        const { date, hrs_mrn_entry, hrs_mrn_exit, hrs_aftn_entry, hrs_aftn_exit, description, codePracticing } = req.body;
        /* Dejar por defecto una evaluacion  */
        const evaluations = 'NULL'
 

        const existingControl = await conn.query(`SELECT * FROM Control WHERE date = ?`, date)
   
        if (existingControl.length > 0) return res.status(400).send({ message: 'This control alredy exists' })

        BigInt.prototype.toJSON = function () { return this.toString() }

        const data = await conn.query(`INSERT INTO control (date, 
                                                            hrs_mrn_entry, 
                                                            hrs_mrn_exit, 
                                                            hrs_aftn_entry,  
                                                            hrs_aftn_exit, 
                                                            description,
                                                            evaluations, 
                                                            codePracticing) 
                                                            VALUES (?,?,?,?,?,?,?,?)`,
            [date, hrs_mrn_entry, hrs_mrn_exit, hrs_aftn_entry, hrs_aftn_exit, description, evaluations, codePracticing])

        console.log(data);
        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally {
        conn.end();
    }
}
