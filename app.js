import express from 'express';
import cors from 'cors';
import deviceRoutes from './routes/deviceRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/devices', deviceRoutes);

export default app;
