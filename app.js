import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { handleError } from './utils/errors.js';
import { authenticateDevice } from './middleware/auth.js';
import { handleDeviceData, getDeviceHistory } from './controllers/deviceController.js';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Device routes
app.post('/api/device/data', authenticateDevice, handleDeviceData);
app.get('/api/device/history', authenticateDevice, getDeviceHistory);

// Error handling middleware
app.use((err, req, res, next) => {
    handleError(err, res);
});

export default app;
