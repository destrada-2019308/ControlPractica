import { Router } from "express";
import {addControl, evaluations, getAllData, getControl } from "./control.controller.js";
import { validateJwt } from "../middlewares/validate_Jwt.js";

const api = Router()

api.get('/getControl/:id', [validateJwt], getControl)
api.get('/getAllData/:id', validateJwt, getAllData)
api.post(`/addControl`, [validateJwt], addControl)
api.put(`/evaluations/:id`, [ validateJwt ], evaluations)

export default api;