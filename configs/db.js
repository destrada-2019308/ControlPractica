import mariadb from 'mariadb';
import { config } from 'dotenv';

config(); 

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
    acquireTimeout: 20000 
});

export default pool;
