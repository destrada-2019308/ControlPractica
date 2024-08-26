import pool from '../../configs/db.js'

import { checkPassword, encrypt } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

const conn = await pool.getConnection();

export const getUsers = async(req, res) =>{
    
    try {
        const data = await conn.query('SELECT * FROM users;')

        console.log(data);
        console.log(data == undefined);
        
        if(data == undefined) return res.status(404).send({ message: 'Data is not found'})
        
        return res.send({  data })
    } catch (err) {
        throw err;
      } finally {
        if (conn) return conn.end();
      }
    }

export const createUser = async(req, res) =>{
    try {
        let { name, lastname, username, email, phone, password, role } = req.body;

        //encriptar la password cuando se envie

        const newPassword = await encrypt(password)
        console.log( newPassword);
        let estado = 'ENABLE'

        let result = await conn.query('INSERT INTO users (name, lastname, username, email, phone, password, role, estado) values (?,?,?,?,?,?,?,?);', [name, lastname, username, email, phone, newPassword, role, estado])
            
        const [existingUser] = await conn.query(
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
    }finally {
        if (conn) return conn.end();
      }
}

export const createAdminDF = async(req, res) =>{
    try {
        //debe ir a ver si existe el usuario por defecto
        const [userExists] = await pool.query(`SELECT * FROM users WHERE username = 'ADMIN'`)

        console.log(userExists.username);
        
        
        if(userExists){
            console.log('El usuario por defecto ya existe ');
        }else{
            const encryptPassword = await encrypt('ADMIN')
            console.log(encryptPassword);
            

            const newUser = await pool.query(`INSERT INTO users (name, lastname, username, email, phone, password, role, estado) values ('ADMIN','ADMIN','ADMIN', 'ADMIN@gmail.com','11111111',?, 'ADMIN', 'ENABLE')`, encryptPassword )
            
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

export const addAttendant = async(req, res) =>{
    try {
        const { role, codeUser } = req.body;
        console.log('Role:',role,'User:', codeUser);
        
        const user = await pool.query(`SELECT * FROM users `)

        const data = await pool.query('UPDATE users SET role = ? where codeUser = ? ', [role, codeUser])
        BigInt.prototype.toJSON = function() { return this.toString()}
        return res.send({ data })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    }
}


export const getUserById = async(req, res) =>{
    try {
        let { id } = req.params
        console.log('Id del usuario',id);
        
        const [user] = await pool.query(`SELECT * FROM users WHERE codeUser = ?`, id)
        console.log(user);
        
        return res.send({ user })
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    }
}

export const updateUser = async(req, res) =>{
    try {
        let { id } = req.params
        let { name, lastname, username, email, phone, role, estado } = req.body;
        let data = await pool.query(`UPDATE users SET name = ?, lastname = ?, username = ?, email = ?, phone = ?, role = ?, estado = ? WHERE codeUser = ?`, [name, lastname, username, email, phone, role, estado, id])
        BigInt.prototype.toJSON = function() { return this.toString()}
        return res.send({ data })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error})
    }
}