import express from 'express';
import { handleDeviceData } from '../controllers/deviceController.js';

const router = express.Router();

router.post('/data', handleDeviceData);

export default router;
