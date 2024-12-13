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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Device = mongoose.model('Device', deviceSchema);
