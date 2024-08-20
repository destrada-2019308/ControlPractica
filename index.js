import express from 'express'
import mariadb from 'mariadb'
import { config } from 'dotenv'
import morgan from 'morgan'

const app = express()
config()
const port = process.env.PORT || 3056

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('User Managment API')
})


app.get('/users', async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users')
        if(!users ) return res.status(404).send({ message: 'No hay datos '})

        return res.send({  message: users })
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

export const initServer = () => {
    app.listen(port)
    console.log(`Server running in port ${port}`);
    
}

initServer()