'use strict'

import { hash, compare } from "bcrypt"

export const encrypt = (password) =>{
    try {
        return hash(password, 10)
    } catch (error) {
        console.error(err);
        return error
    }
}

export const checkPassword = async(password, hash) =>{
    try {
        return await compare(password, hash);
    } catch (err) {
        console.error(err);
        return err;
    }
}