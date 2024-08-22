import { initializeDatabase } from './query.js'
import { initServer } from './configs/app.js'
import { createAdminDF } from './src/user/user.controller.js'

/*
app.get('/', (req, res) => {
    res.send('User Managment API')
})
*/

initServer()
initializeDatabase();
//createAdminDF()