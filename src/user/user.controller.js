import pool from '../../configs/db.js'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit-table'
 
import { checkPassword, encrypt } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
 

export const getUsers = async (req, res) => {

    const conn = await pool.getConnection();

    try {
        const data = await conn.query(`SELECT * FROM users ;`)

        //if (data.length === 0) return res.status(404).send({ message: 'Data is not found' })

        return res.send({ data })
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
}

export const createUser = async (req, res) => {

    const conn = await pool.getConnection();

    try {
        let { nameUser, lastname, username, email, phone, password, role, state } = req.body;
        let allData = [nameUser, lastname, username, email, phone, password, role, state]
        let sendData = `\n Nombre: ${nameUser}, Apellido: ${lastname}, Username: ${username}, Email: ${email}, Phone: ${phone}, Password: ${password}, Role: ${role} \n`
        /*console.log(sendData);
        
        console.log('Esto es toda la data',allData);
        */
        //encriptar la password cuando se envie
        const newPassword = await encrypt(password)
        /*
        console.log(password);
        console.log(newPassword);
        console.log(email);
        */
        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        //console.log(existingUser);


        if (existingUser) {
            console.error('Error with username or email La prueba');
            return res.status(400).send({ error: 'Username or Email already exists' });


        } else {
            //console.log(allData);

            let result = await conn.query('INSERT INTO users (nameUser, lastname, username, email, phone, password, role, state) values (?,?,?,?,?,?,?,?);', [nameUser, lastname, username, email, phone, newPassword, role, state])
            //console.log('Esto es result',result);
            let to = email
            let subject = 'Text for default'
            let text = `Estos son sus datos : \b ${sendData} \b Ingrese a nuestra pagina y loggeese con su username y su password `
            emailValidate(to, subject, text)
            BigInt.prototype.toJSON = function () { return this.toString() }

            return res.send({ result })
        }


    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message })
    } finally {
        conn.release();
    }
}

const emailValidate = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "estradajuarezdiegorene@gmail.com",
            pass: "bvpy qbeh tqwc jvdy",
        },
    });

    // Set up email options
    let mailOptions = {
        from: "estradajuarezdiegorene@gmail.com",
        to: to,
        subject: subject,
        text: text,
    };

    // Send the email
    //console.log(mailOptions);

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export const validateEmail = async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        console.log(to, subject, text);

        let info = await emailValidate(to, subject, text)
        return res.send({ message: `Email enviado a : ${to} `, info })
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error sending email");
    }
}

export const createAdminDF = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        //debe ir a ver si existe el usuario por defecto
        const [userExists] = await conn.query(`SELECT * FROM users WHERE username = 'ADMIN'`)

        //console.log(userExists.username);


        if (userExists) {
            console.log('El usuario por defecto ya existe ');
        } else {
            const encryptPassword = await encrypt('ADMIN')
            //console.log(encryptPassword);


            const newUser = await conn.query(`INSERT INTO users (nameUser, lastname, username, email, phone, password, role, state) values ('ADMIN','ADMIN','ADMIN', 'ADMIN@gmail.com','11111111',?, 'ADMIN', 'ENABLE')`, encryptPassword)

            //console.log(newUser);
            //console.log('Admin created successfully');

            return res.send({ message: 'Se creo'})
        }
        

    } catch (error) {
        console.error(error);
        return error
    } finally {
        conn.release()
    }
}

export const login = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { username, password } = req.body;

        const [user] = await conn.query(`SELECT * FROM users WHERE username = ?`, username)

        //console.log(user == undefined);

        if (user == undefined) return res.status(404).send({ message: 'User not found' })

        //console.log(user);


        if (user && await checkPassword(password, user.password)) {
            const [userLogged] = await conn.query("SELECT * FROM users WHERE username = ?;", [username])

            //console.log(userLogged);

            let token = await generateJwt(userLogged)

            //console.log(token);

            return res.send({ message: `Welcome ${userLogged.nameUser}`, userLogged, token })


        }

        return res.status(404).send({ message: 'User not found' })

    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: true, err })
    } finally {
        if (conn) conn.release()
    }
}

/* agregar un encargado */


export const historial = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
         
        const allData = await conn.query(`
            SELECT 
                u.codeUser, 
                u.nameUser,
                u.lastname,
                u.username,
                u.email, 
                sch.nameSchool,
                sch.addressSchool,
                cr.nameCareer, 
                supUser.nameUser AS supervisorName,
                c.codeControl,
                c.date,
                c.hrs_mrn_entry AS morning_entry,
                c.hrs_mrn_exit AS morning_exit,
                c.hrs_aftn_entry AS afternoon_entry,
                c.hrs_aftn_exit AS afternoon_exit,
                c.description,
                c.evaluations
            FROM Practicing p 
            JOIN Users u ON p.codeUser = u.codeUser
            JOIN Supervisor sp ON p.codeSupervisor = sp.codeSupervisor
            JOIN Users supUser ON sp.codeUser = supUser.codeUser
            JOIN School sch ON p.codeSchool = sch.codeSchool
            JOIN Career cr ON p.codeCareer = cr.codeCareer 
            JOIN Control c ON c.codePracticing = p.codePracticing
            WHERE p.codePracticing = ?`, [id]);

        if (!allData.length) {
            return res.status(404).send({ message: "No data found for the specified user" });
        }

        const pdfFolder = './histiorial'
        if(!fs.existsSync(pdfFolder)){
            fs.mkdirSync(pdfFolder)
        }

        const doc = new PDFDocument({layout: 'landscape'});
        const filePath = path.join(pdfFolder, `historial_${id}.pdf`);
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(20).text(`Historial del Usuario: ${allData[0].nameUser}`, { align: 'center' });

        doc.moveDown();
        doc.fontSize(14).text(`Nombre: ${allData[0].nameUser}`);
        doc.text(`Apellido: ${allData[0].lastname}`);
        doc.text(`Username: ${allData[0].username}`);
        doc.text(`Email: ${allData[0].email}`);

        doc.moveDown();
        doc.fontSize(16).text('Datos del Practicante:', { underline: true });
        doc.fontSize(14).text(`Institución: ${allData[0].nameSchool}`);
        doc.text(`Carrera: ${allData[0].nameCareer}`);
        doc.text(`Supervisor: ${allData[0].supervisorName}`);

        doc.moveDown();
        doc.fontSize(16).text('Control de Práctica:', { underline: true });

        const table = {
            title: "Historial de Control",
            headers: ["Fecha", "Entrada (Mañana)", "Salida (Mañana)", "Entrada (Tarde)", "Salida (Tarde)", "Descripción", "Evaluación"],
            rows: allData.map(control => [
                new Date(control.date).toLocaleDateString(),
                control.morning_entry,
                control.morning_exit,
                control.afternoon_entry,
                control.afternoon_exit,
                control.description,
                control.evaluations
            ])
        };
        doc.table(table, {
            width: 500, // Ajusta el ancho según tus necesidades
            columnsSize: [80, 70, 70, 70, 70, 150, 100]
        });

        /*allData.forEach(control => {
            doc.moveTo(0, 20);
            doc.fontSize(14).text(`Fecha: ${new Date(control.date).toLocaleDateString()}`);
            doc.text(`Entrada (Mañana): ${control.morning_entry}`);
            doc.text(`Salida (Mañana): ${control.morning_exit}`);
            doc.text(`Entrada (Tarde): ${control.afternoon_entry}`);
            doc.text(`Salida (Tarde): ${control.afternoon_exit}`);
            doc.text(`Descripción: ${control.description}`);
            doc.text(`Evaluación: ${control.evaluations}`);
        });*/

        doc.end();

        res.setHeader('Content-disposition', `attachment; filename=historial_${id}.pdf`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    } finally {
        if (conn) conn.release();
    }
};


export const updateUser = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        let { id } = req.params
        let { nameUser, lastname, username, email, phone, role, state } = req.body;
        let data = await conn.query(`UPDATE users SET nameUser = ?, lastname = ?, username = ?, email = ?, phone = ?, role = ?, state = ? WHERE codeUser = ?`, [nameUser, lastname, username, email, phone, role, state, id])
        BigInt.prototype.toJSON = function () { return this.toString() }
        return res.send({ data })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error })
    } finally {
        if (conn) conn.release()
    }
}