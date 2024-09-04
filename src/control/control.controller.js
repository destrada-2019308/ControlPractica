import pool from "../../configs/db.js";

/* Buscqueda de control por practicante */
export const getControl = async (req, res) => {
    let conn = await pool.getConnection()

    try {

        let { id } = req.params;

        const get = await conn.query('SELECT * FROM control WHERE codePracticing = ?', id)

        //if (get.length === 0) return res.status(404).send({ message: 'Data is no found' })

        return res.send({ get })

    } catch (error) {
        console.error(error);
        return error
    } finally {
        conn.release();
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



        //if (get.length === 0) return res.status(404).send({ message: 'Data is no found' })

        return res.send({ get })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: error })
    } finally {
        conn.release()
    }
}

export const addControl = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        const { date, hrs_mrn_entry, hrs_mrn_exit, hrs_aftn_entry, hrs_aftn_exit, description, codePracticing } = req.body;
        /* Dejar por defecto una evaluacion  */
        const evaluations = 'PENDIENTE'

        /*         
            sumatorita de horas diaris 

            resta de practice_hrs

            validacoipn de fechas
        */
        console.log(hrs_mrn_entry, hrs_mrn_exit, hrs_aftn_entry, hrs_aftn_exit);
        
        

        let h1 = hrs_mrn_entry.split(":");
        let h2 = hrs_mrn_exit.split(":");
        let h3 = hrs_aftn_entry.split(":");
        let h4 = hrs_aftn_exit.split(":")

        let newhrs1 = ((h2[0]-h1[0]) ) 
        let newhrs2 = ((h4[0]-h3[0]) ) 

        console.log(newhrs1 + newhrs2);
        let result1 = (newhrs1 + newhrs2) 

        console.log(result1);
        
        let newmin1 = ((h2[1]-h1[1])) 
        let newmin2 = ((h4[1]-h3[1])) 
        
        console.log(newmin1 + newmin2);
        let result2 = (newmin1 + newmin2) 

        let newdate = result1 + ":" +result2
        console.log(newdate);
        let convhrs = (result1 + (result2 / 60))

        console.log(convhrs);
        
        //Vamos a traer las horas del practicante 
        console.log(codePracticing);
        let horas = await conn.query(`SELECT practice_hrs FROM practicing WHERE codePracticing = ? ;`, codePracticing)
        console.log(horas);
        
        console.log(horas[0].practice_hrs);

        //Restamos las horas que hicimos hoy con las horas fijas
        let newhrs = horas[0].practice_hrs - convhrs
        console.log(newhrs);

        let hrs_restantes = Math.floor(newhrs)
        let min_restantes = Math.round((newhrs - hrs_restantes)*60)
        console.log(hrs_restantes + ":" + min_restantes);
        
        //Hacemos el update a la tabla practicante para setear la nueva data
         
        if(newhrs == NaN){
            return res.status(404).send({ message: 'Agrega un dato' })
        }
        await conn.query(`UPDATE Practicing SET practice_hrs = ? WHERE codePracticing = ?;`, [newhrs, codePracticing])
  
        console.log(date);

        const fh = new Date() 
        
        let fecha = (fh.toISOString().split("T"))[0]
        
        if(date != fecha){
          console.log('Es diferente')
          return res.status(400).send({ message: 'No puedes agregar otra fecha' })
        } 

        const existingControl = await conn.query(`SELECT * FROM Control WHERE date = ? AND codePracticing = ?`, [date, codePracticing])

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
        conn.release();
    }
}

export const evaluations = async (req, res) => {
    let conn = await pool.getConnection()
    try {
        let { id } = req.params;
        let { evaluations } = req.body;
        BigInt.prototype.toJSON = function () { return this.toString() }
        console.log(id, evaluations);

        let data = await conn.query(`UPDATE Control SET evaluations = ? WHERE codeControl = ?`, [evaluations, id])

        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally {
        conn.release()
    }
}