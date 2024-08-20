import { initializeDatabase } from './query.js'
import { initServer } from './configs/app.js'

/*
app.get('/', (req, res) => {
    res.send('User Managment API')
})
*/

initServer()
initializeDatabase();
