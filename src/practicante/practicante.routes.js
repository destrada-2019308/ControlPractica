import { Router } from "express";
import { validateJwt } from "../middlewares/validate_Jwt.js";
import { addPracticing, getPracticing, getUserPracticing, updatePracticing } from "./practicante.controller.js";

const api = Router();


api.get('/getPracticing', getPracticing)
api.get('/getUserPracticing', validateJwt, getUserPracticing)
api.post('/addPracticing', validateJwt ,addPracticing)
api.put('/updatePracticing/:id', [validateJwt],updatePracticing)

export default api;