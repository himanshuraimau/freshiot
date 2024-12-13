import mongoose from 'mongoose';

const deviceDataSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

export const DeviceData = mongoose.model('DeviceData', deviceDataSchema);
