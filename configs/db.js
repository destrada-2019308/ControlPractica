import mariadb from 'mariadb';
import { config } from 'dotenv';

config(); 

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, 
    connectionLimit: 150, 
    acquireTimeout: 1000, 
});

export default pool;

/*async function queryWithRetry(query, params, retries = 3) {
    let attempts = 0;
    while (attempts < retries) {
        try {
            const conn = await pool.getConnection();
            const result = await conn.query(query, params);
            conn.release();
            return result;
        } catch (error) {
            attempts++;
            if (attempts >= retries) throw error;
        }
    }
}
*/