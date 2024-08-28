'use strict'

import { Router } from "express"
import { addWorkstation, getWorkstation, updateWorkstation } from "./workstation.controller.js";
import { isAdmin, validateJwt } from "../middlewares/validate_Jwt.js";

const api = Router()

api.get('/getWorkstation', validateJwt, getWorkstation)
api.post('addWorkstation', [validateJwt, isAdmin], addWorkstation)
api.put('/updateWorkstation/:id', [validateJwt, isAdmin], updateWorkstation)

export default api;