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

export const getDeviceHistory = async (req, res) => {
  try {
    const { deviceId, startDate, endDate, limit = 1000 } = req.query;
    
    const query = { device: deviceId };
    
    // If no dates provided, default to last 24 hours
    if (!startDate && !endDate) {
      query.createdAt = {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // last 24 hours
      };
    } else if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get data points sorted by timestamp
    const history = await DeviceData.find(query)
      .sort({ createdAt: 1 }) // Changed to ascending order for proper graphing
      .select('temperature humidity location createdAt')
      .limit(parseInt(limit))
      .populate('device', 'deviceName status');

    // Process data for graphing
    const graphData = {
      labels: history.map(record => record.createdAt),
      temperature: history.map(record => record.temperature),
      humidity: history.map(record => record.humidity),
      locations: history.map(record => record.location)
    };

    // Calculate some statistics
    const stats = {
      avgTemperature: calculateAverage(graphData.temperature),
      avgHumidity: calculateAverage(graphData.humidity),
      minTemperature: Math.min(...graphData.temperature),
      maxTemperature: Math.max(...graphData.temperature),
      minHumidity: Math.min(...graphData.humidity),
      maxHumidity: Math.max(...graphData.humidity),
      totalReadings: history.length
    };

    res.status(200).json({
      success: true,
      stats,
      graphData,
      deviceInfo: history[0]?.device // Include device info from the first record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function for calculating averages
const calculateAverage = (values) => {
  if (!values.length) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return (sum / values.length).toFixed(2);
};

// Add new endpoint for real-time data
export const getLatestData = async (req, res) => {
  try {
    const { deviceId } = req.query;
    
    const latestData = await DeviceData.findOne({ device: deviceId })
      .sort({ createdAt: -1 })
      .select('temperature humidity location createdAt')
      .populate('device', 'deviceName status');

    res.status(200).json({
      success: true,
      data: latestData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
