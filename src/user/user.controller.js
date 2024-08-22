import pool from '../../configs/db.js'

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

        const result = await pool.query('INSERT INTO users (name, username, email, phone, password) values (?,?,?,?,?);', [name, username, email, phone, password])
            
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

export const login = async(req, res) =>{
    try {
        const { username, password } = req.body;
        
        const userLogged = await pool.query("SELECT * FROM users WHERE username = ? AND password = ?;", [username, password])

        console.log(userLogged);
        

        res.send({ userLogged })

    } catch (err) {
        console.error(err);
        return err
    }
} 