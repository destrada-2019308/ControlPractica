import { Router } from "express";
import { addAttendant, createUser, getUsers, login } from "./user.controller.js";
import { validateJwt } from "../middlewares/validate_Jwt.js";

const api = Router()

api.get('/getUsers', validateJwt ,getUsers)
api.post('/createUser', createUser)
api.post('/login', login)
api.put('/addAttendant', validateJwt ,addAttendant)

export default api;