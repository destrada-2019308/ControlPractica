import { Router } from "express";
import { createUser, getUsers, login } from "./user.controller.js";

const api = Router()

api.get('/getUsers', getUsers)
api.post('/createUser', createUser)
api.post('/login', login)

export default api;