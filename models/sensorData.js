import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
    index: true
  },
  temperature: Number,
  humidity: Number,
  location: {
    latitude: Number,
    longitude: Number
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export const SensorData = mongoose.model('SensorData', sensorDataSchema);
