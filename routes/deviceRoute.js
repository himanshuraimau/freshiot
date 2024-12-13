import express from 'express';
import { handleDeviceData, getDeviceHistory } from '../controllers/deviceController.js';

const router = express.Router();

router.post('/data', handleDeviceData);
router.get('/history', getDeviceHistory);

export default router;
