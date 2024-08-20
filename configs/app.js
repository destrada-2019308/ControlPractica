import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

import userRoutes from '../src/user/user.routes.js';

const app = express();
config();
const port = process.env.PORT || 3056;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(cors()); 
app.use(helmet());

app.use('/user', userRoutes);

export const initServer = () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};
