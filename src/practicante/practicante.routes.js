import { Router } from "express";
import { validateJwt } from "../middlewares/validate_Jwt.js";
import { addPracticing, getManager, getPracticingById } from "./practicante.controller.js";

const api = Router();

api.post('/addPracticing', validateJwt ,addPracticing)
api.get('/getPracticingById/:id', getPracticingById)
api.get('/getManager', getManager)

export default api;