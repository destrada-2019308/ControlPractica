'use strict'

import { Router } from "express"
import { addSchool, getSchool, updateSchool } from "./school.controller.js"
import { isAdmin, validateJwt } from "../middlewares/validate_Jwt.js"

const api = Router()

api.get('/getSchool', [validateJwt], getSchool)
api.post('/addSchool', [validateJwt, isAdmin], addSchool)
api.put('/updateSchool/:id', [validateJwt, isAdmin], updateSchool)

export default api