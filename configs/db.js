import mariadb from 'mariadb';
import { config } from 'dotenv';

config(); 

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 100, 
    acquireTimeout: 10000,
    idleTimeout: 10000,
    queueLimit: 100
});

export default pool;
