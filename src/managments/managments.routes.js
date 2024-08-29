'use strict'

import { Router } from "express"
import { validateJwt } from "../middlewares/validate_Jwt.js";
import { addManagments, getManagments, updateManagments } from "./managments.controller.js";

const api = Router()

api.get('/getManagments', [ validateJwt ], getManagments)
api.post('/addManagments', [ validateJwt ], addManagments)
api.put('/updateManagments/:id', validateJwt, updateManagments)

export default api;