import { Router } from "express";
import { createControl, evaluation, getControlByUser, getControlManaClient, getData } from "./control.controller.js";

const api = Router()

api.get('/getData', getData)
api.post('/createControl', createControl)
api.get('/getControlByUser/:id', getControlByUser)
api.put('/evaluation', evaluation)
api.get('/getControlManaClient/:id', getControlManaClient)

export default api;