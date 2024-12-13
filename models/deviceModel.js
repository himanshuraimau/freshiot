import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  temperature: Number,
  humidity: Number,
  location: {
    latitude: Number,
    longitude: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Device = mongoose.model('Device', deviceSchema);
