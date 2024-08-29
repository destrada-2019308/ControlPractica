import mariadb from 'mariadb';
import { config } from 'dotenv';

config(); 

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 35, 
    acquireTimeout: 15000,
    idleTimeout: 30000,
    queueLimit: 50
});

export default pool;
