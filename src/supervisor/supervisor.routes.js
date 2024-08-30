'use strict'

import { Router } from "express"
import { addSupervisor, getSupervisor, getUserSupervisor, updateSupervisor } from "./supervisor.controller.js"
import { validateJwt } from "../middlewares/validate_Jwt.js"

const api = Router()

api.get('/getSupervisor', [validateJwt], getSupervisor)
api.get('/getUserSupervisor', [validateJwt], getUserSupervisor)
api.post('/addSupervisor', [validateJwt], addSupervisor)
api.put('/updateSupervisor/:id', [validateJwt], updateSupervisor)

export default api