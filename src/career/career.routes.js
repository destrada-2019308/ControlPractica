'use strict'

import { Router } from "express"
import { isAdmin, validateJwt } from "../middlewares/validate_Jwt.js";
import { addCareer, getCareer, updateCareer } from "./career.controller.js";

const api = Router()

api.get('/getCareer', validateJwt, getCareer)
api.post('/addCareer', [validateJwt, isAdmin], addCareer)
api.put('/updateCareer/:id', [validateJwt, isAdmin], updateCareer)

export default api;