import { Router } from "express";
import { createControl, getControlByUser, getData } from "./control.controller.js";

const api = Router()

api.get('/getData', getData)
api.post('/createControl', createControl)
api.get('/getControlByUser/:id', getControlByUser)

export default api;