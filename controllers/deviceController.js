import { Device } from '../models/deviceModel.js';
import crypto from 'crypto';

const generatePassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

export const handleDeviceData = async (req, res) => {
  try {
    const { deviceName, temperature, humidity, latitude, longitude } = req.body;

    let device = await Device.findOne({ deviceName });
    let password;

    if (!device) {
      // New device registration
      password = generatePassword();
      device = await Device.create({
        deviceName,
        password,
        temperature,
        humidity,
        location: { latitude, longitude }
      });
    } else {
      // Update existing device
      device.temperature = temperature;
      device.humidity = humidity;
      device.location = { latitude, longitude };
      device.lastUpdated = new Date();
      await device.save();
    }

    res.status(200).json({
      success: true,
      device: {
        deviceName: device.deviceName,
        password: password // Only returned for new devices
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
