import pool from '../../configs/db.js'

import { checkPassword, encrypt } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const getUsers = async(req, res) =>{
    let connection;
    try {

        connection = await pool.getConnection()

        const users = await connection.query('SELECT * FROM users')

        if(!users ) return res.status(404).send({ message: 'No hay datos '})

        return res.send({  users })
    } catch (err) {
        console.error('Error al obtener usuarios:', err); 
        return res.status(500).send({ error: 'Error en el servidor', err }); 
    } finally {
        if (connection) connection.release(); 
    }
}

export const createUser = async(req, res) =>{
    try {
        const { name, username, email, phone, password } = req.body;

        //encriptar la password cuando se envie

        const role = 'CLIENT'

        const newPassword = await encrypt(password)
        console.log( newPassword);
        

        const result = await pool.query('INSERT INTO users (name, username, email, phone, password, role) values (?,?,?,?,?,?);', [name, username, email, phone, newPassword, role])
            
        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );



        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or Email already exists' });
        }
        BigInt.prototype.toJSON = function() { return this.toString() }

        res.json({ result})
    } catch (err) {
        console.error(err);
        
        return res.status(500).send({ error: err.message})      
    }
}

export const createAdminDF = async(req, res) =>{
    try {
        //debe ir a ver si existe el usuario por defecto
        const userExists = await pool.query(`SELECT * FROM users WHERE username = 'ADMIN'`)

        //console.log(userExists);
        

        if(!userExists){
            console.log('El usuario por defecto ya existe ');
        }else{
            const encryptPassword = await encrypt('ADMIN')
            console.log(encryptPassword);
            

            const newUser = await pool.query(`INSERT INTO users (name, username, email, phone, password, role) values ('ADMIN','ADMIN', 'ADMIN@gmail.com','11111111',?, 'ADMIN')`, encryptPassword )
            
            console.log(newUser);
            console.log('Admin created successfully');
            
        }

    } catch (error) {
        console.error(error);
        return error
    }
}

export const login = async(req, res) =>{
    try {
        const { username, password } = req.body;

        const [user] = await pool.query(`SELECT * FROM users WHERE username = ?`, username)
        
       //console.log(user == undefined);
        
        if( user == undefined) return res.status(404).send({ message: 'User not found' })

        //console.log(user);
        

        if(user && await checkPassword(password, user.password)){
            const [userLogged] = await pool.query("SELECT * FROM users WHERE username = ?;", [username])

            console.log(userLogged);

            let token = await generateJwt(userLogged)
        
            console.log(token);
            
            return res.send({ message: `Welcome ${userLogged.name}`, userLogged, token})
            

        }

        return res.status(404).send({ message: 'User not found'})

    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: true, err})
    }
} 


/* agregar un encargado */


