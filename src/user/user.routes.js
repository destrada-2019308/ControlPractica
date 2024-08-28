import { Router } from "express";
import { addAttendant, createUser, validateEmail, getUserById, getUsers, login, updateUser, historial } from "./user.controller.js";
import { isAdmin, validateJwt } from "../middlewares/validate_Jwt.js";

const api = Router()

api.get('/getUsers', [validateJwt], getUsers)
api.post('/login', login)
api.post('/createUser', [validateJwt, isAdmin], createUser)

api.get('/getUserById/:id', getUserById)

api.put('/updateUser/:id', updateUser)

api.put('/addAttendant', validateJwt ,addAttendant)
api.post('/sendEmail', validateEmail)
api.get('/historial/:id', historial)

export default api;