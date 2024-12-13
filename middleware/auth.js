import { Device } from '../models/deviceModel.js';

export const authenticateDevice = async (req, res, next) => {
    try {
        const { deviceName, password } = req.headers;
        if (!deviceName || !password) {
            return res.status(401).json({
                success: false,
                message: "Authentication credentials missing"
            });
        }

        const device = await Device.findOne({ deviceName });
        if (!device || device.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        req.device = device;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
