import mariadb from 'mariadb';
import { config } from 'dotenv';

config(); 

const pool = mariadb.createPool({
    host: 'localhost', 
    user: 'root', 
    password: 'root',
    database: 'practiceControl',
    connectionLimit: 150
  });

  export default pool;