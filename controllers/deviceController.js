import { Device } from '../models/deviceModel.js';
import { DeviceData } from '../models/deviceDataModel.js';
import crypto from 'crypto';

export const handleDeviceData = async (req, res) => {
  try {
    const { deviceName, temperature, humidity, latitude, longitude } = req.body;

    // Find or update device
    let device = await Device.findOne({ deviceName });
    if (!device) {
      device = await Device.create({
        deviceName,
        password: crypto.randomBytes(8).toString('hex'),
        status: 'active'
      });
    }

    // Update device's last active timestamp
    device.lastActive = new Date();
    await device.save();

    // Create new device data entry
    const deviceData = await DeviceData.create({
      device: device._id,
      temperature,
      humidity,
      location: { latitude, longitude }
    });

    res.status(200).json({
      success: true,
      device: {
        deviceId: device._id,
        deviceName: device.deviceName
      },
      data: deviceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

