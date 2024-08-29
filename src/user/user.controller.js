import pool from '../../configs/db.js'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

import { checkPassword, encrypt } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'


export const getUsers = async(req, res) =>{
    
const conn = await pool.getConnection();

    try {
        const data = await conn.query(`SELECT * FROM users WHERE state = 'ENABLE';`)
        
        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})
        
        return res.send({  data })
    } catch (err) {
        throw err;
      } finally {
        conn.end();
      }
    }

export const createUser = async(req, res) =>{
    
const conn = await pool.getConnection();

    try {
        let { name, lastname, username, email, phone, password, role, estado } = req.body;
        let allData =  [name, lastname, username, email, phone, password, role, estado]
        let sendData = `\b Nombre: ${name}, Apellido: ${lastname}, Username: ${username}, Email: ${email}, Phone: ${phone}, Password: ${password}, Role: ${role} \b`
        console.log(sendData);
        
        console.log('Esto es toda la data',allData);
        
        //encriptar la password cuando se envie
        const newPassword = await encrypt(password)
        
        console.log(password);
        console.log(newPassword);
        console.log(email);
        
        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        console.log(existingUser);
        
        
        if (existingUser){
            console.error('Error with username or email La prueba');
            return res.status(400).send({ error: 'Username or Email already exists' });
            
            
        } else {
            let result = await conn.query('INSERT INTO users (name, lastname, username, email, phone, password, role, estado) values (?,?,?,?,?,?,?,?);', [name, lastname, username, email, phone, newPassword, role, estado])
            console.log('Esto es result',result);
            let to = email
            let subject = 'Text for default'
            let text = `Estos son sus datos : \b ${sendData} \b Ingrese a nuestra pagina y loggeese con su username y su password `
            emailValidate(to, subject, text)
            BigInt.prototype.toJSON = function() { return this.toString() }

        return res.send({ result})
        }

        
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message})      
    }finally {
        conn.end();
      }
}

const emailValidate = async(to, subject, text) =>{
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
      console.log(mailOptions);
      
      try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
}

export const validateEmail = async(req, res) =>{
    try {
        const { to, subject, text } = req.body;
        console.log(to, subject, text);
        
        let info = await emailValidate(to, subject, text)
        return res.send({ message: `Email enviado a : ${to} `, info})
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error sending email");
    }
}

export const createAdminDF = async(req, res) =>{
    const conn = await pool.getConnection();
    try {
        //debe ir a ver si existe el usuario por defecto
        const [userExists] = await conn.query(`SELECT * FROM users WHERE username = 'ADMIN'`)

        //console.log(userExists.username);
        
        
        if(userExists){
            console.log('El usuario por defecto ya existe ');
        }else{
            const encryptPassword = await encrypt('ADMIN')
            console.log(encryptPassword);
            

            const newUser = await conn.query(`INSERT INTO users (name, lastname, username, email, phone, password, role, state) values ('ADMIN','ADMIN','ADMIN', 'ADMIN@gmail.com','11111111',?, 'ADMIN', 'ENABLE')`, encryptPassword )
            
            //console.log(newUser);
            //console.log('Admin created successfully');
            
        }

    } catch (error) {
        console.error(error);
        return error
    } finally{
        conn.end()
    }
}

export const login = async(req, res) =>{
    const conn = await pool.getConnection();
    try {
        const { username, password } = req.body;

        const [user] = await conn.query(`SELECT * FROM users WHERE username = ?`, username)
        
       //console.log(user == undefined);
        
        if( user == undefined) return res.status(404).send({ message: 'User not found' })

        //console.log(user);
        

        if(user && await checkPassword(password, user.password)){
            const [userLogged] = await conn.query("SELECT * FROM users WHERE username = ?;", [username])

            //console.log(userLogged);

            let token = await generateJwt(userLogged)
        
            //console.log(token);
            
            return res.send({ message: `Welcome ${userLogged.name}`, userLogged, token})
            

        }

        return res.status(404).send({ message: 'User not found'})

    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: true, err})
    } finally{
        conn.end
    }
} 



/* agregar un encargado */

export const addAttendant = async(req, res) =>{
    const conn = await pool.getConnection();
    try {
        const { role, codeUser } = req.body;
        console.log('Role:',role,'User:', codeUser);
        
        const user = await conn.query(`SELECT * FROM users `)

        const data = await conn.query('UPDATE users SET role = ? where codeUser = ? ', [role, codeUser])
        BigInt.prototype.toJSON = function() { return this.toString()}
        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally{
        conn.end()
    }
}


export const getUserById = async(req, res) =>{
    const conn = await pool.getConnection();
    try {
        let { id } = req.params
        console.log('Id del usuario',id);
        
        const [user] = await conn.query(`SELECT * FROM users WHERE codeUser = ?`, id)
        console.log(user);
        
        return res.send({ user })
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    } finally{
        conn.end()
    }
}

export const historial = async(req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const allData = await conn.query(`
            SELECT u.name, u.username, u.email, u.phone, u.role, u.estado, 
                   p.institucion, p.carrera, p.empresa, p.encargado,
                   pc.date, pc.hour_morning_entry, pc.hour_morning_exit, 
                   pc.hour_afternoon_entry, pc.hour_afternoon_exit, 
                   pc.description, pc.evaluations
            FROM PracticControl pc
            JOIN Practicante p ON pc.codePracticante = p.codePracticante
            JOIN Users u ON p.codeUser = u.codeUser 
            WHERE u.codeUser = ?;
        `, [id]);
            console.log(allData)
            
        if (!allData.length) {
            return res.status(404).send({ message: "No data found for the specified user" })
        }

        const doc = new PDFDocument()
        const filePath = path.join( `historial_${id}.pdf`)
        doc.pipe(fs.createWriteStream(filePath))
        doc.fontSize(20).text(`Historial del Usuario: ${allData[0].name}`, { align: 'center' })

        doc.moveDown()
        doc.fontSize(14).text(`Nombre: ${allData[0].name}`)
        doc.text(`Username: ${allData[0].username}`)
        doc.text(`Email: ${allData[0].email}`)
        doc.text(`Teléfono: ${allData[0].phone}`)
        doc.text(`Rol: ${allData[0].role}`)
        doc.text(`Estado: ${allData[0].estado}`)

        doc.moveDown()
        doc.fontSize(16).text('Datos del Practicante:', { underline: true })
        doc.fontSize(14).text(`Institución: ${allData[0].institucion}`)
        doc.text(`Carrera: ${allData[0].carrera}`)
        doc.text(`Empresa: ${allData[0].empresa}`)
        doc.text(`Encargado: ${allData[0].encargado}`)

        doc.moveDown()

        doc.fontSize(16).text('Control de Práctica:', { underline: true })

        allData.forEach((control, index) => {
            doc.moveDown();
            doc.fontSize(14).text(`Fecha: ${new Date(control.date).toLocaleDateString()}`)
            doc.text(`Entrada (Mañana): ${control.hour_morning_entry}`)
            doc.text(`Salida (Mañana): ${control.hour_morning_exit}`)
            doc.text(`Entrada (Tarde): ${control.hour_afternoon_entry}`)
            doc.text(`Salida (Tarde): ${control.hour_afternoon_exit}`)
            doc.text(`Descripción: ${control.description}`)
            doc.text(`Evaluación: ${control.evaluations}`)
        
        });
        doc.end();
        doc.on('finish', () => {
            res.download(filePath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: 'Error sending file' })
                }

                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err)
                });
            });
        });

        res.download(filePath, `historial_${id}.pdf`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Error sending file' });
            }

            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });

    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: error.message })
    }finally{
        conn.end()
    }
}

export const updateUser = async(req, res) =>{
    const conn = await pool.getConnection();
    try {
        let { id } = req.params
        let { name, lastname, username, email, phone, role, estado } = req.body;
        let data = await conn.query(`UPDATE users SET name = ?, lastname = ?, username = ?, email = ?, phone = ?, role = ?, estado = ? WHERE codeUser = ?`, [name, lastname, username, email, phone, role, estado, id])
        BigInt.prototype.toJSON = function() { return this.toString()}
        return res.send({ data })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    }finally{
        conn.end()
    }
}