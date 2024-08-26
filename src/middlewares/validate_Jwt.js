'use strict'

import jwt from 'jsonwebtoken'
import pool from '../../configs/db.js'

export const validateJwt = async(req, res, next) =>{
    try {
        let secretKey = process.env.SECRET_KEY;
        let { authorization } = req.headers;
        //console.log(authorization);
        
        if( !authorization ) return res.status(401).send({ message: 'Unauthorized'})
            

        let { codeUser } = jwt.verify(authorization, secretKey)

        console.log(codeUser);
        
        let conn = await pool.getConnection()
        const user = await conn.query('select * from Users where codeUser = ?', codeUser)

        console.log('Este es el user:  ', user);
        

        if(!user ) return res.status(404).send({ message: 'User not found'})
            console.log(user);
            
        req.user = user;
        console.log('Esto es de req.user: ', req.user);
        
        next()
    } catch (error) {
        console.error(error);
        return res.status(401).send({ message: 'Invalid token'})
    }
}