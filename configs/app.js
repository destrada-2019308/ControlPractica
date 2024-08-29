import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

import userRoutes from '../src/user/user.routes.js';
import schoolRoutes from '../src/school/school.routes.js'
import careerRoutes from '../src/career/career.routes.js'
import workstationRoutes from '../src/workstation/workstation.routes.js'
import managmentsRoutes from '../src/managments/managments.routes.js'

const app = express();
config();
const port = process.env.PORT || 3056;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(cors()); 
app.use(helmet());

app.use('/user', userRoutes);
app.use('/school', schoolRoutes)
app.use('/career', careerRoutes)
app.use('/workstation', workstationRoutes)
app.use('/managments', managmentsRoutes)

export const initServer = () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};
