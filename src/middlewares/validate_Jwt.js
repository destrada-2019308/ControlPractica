'use strict'

import jwt from 'jsonwebtoken'
import pool from '../../configs/db'

export const validateJwt = async(req, res, next) =>{
    try {
        let secretKey = process.env.SECRET_KEY;
        let { authorization } = req.header;
        if( !authorization ) return res.status(401).send({ message: 'Unauthorized'})
        
        let { uid } = jwt.verify(authorization, secretKey)

        let conn = await pool.getConnection()
        const user = await conn.query('select * from Users')

        if(!user ) return res.status(404).send({ message: 'User not found'})

        req.user = user;
        next()
    } catch (error) {
        console.error(error);
        return res.status(401).send({ message: 'Invalid token'})
    }
}