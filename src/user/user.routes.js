import { Router } from "express";
import { addAttendant, createUser, getUserById, getUsers, login, updateUser } from "./user.controller.js";
import { isAdmin, validateJwt } from "../middlewares/validate_Jwt.js";

const api = Router()

api.get('/getUsers', [validateJwt], getUsers)
api.get('/getUserById/:id', getUserById)
api.post('/createUser', [validateJwt, isAdmin], createUser)
api.put('/updateUser/:id', updateUser)
api.post('/login', login)
api.put('/addAttendant', validateJwt ,addAttendant)

export default api;