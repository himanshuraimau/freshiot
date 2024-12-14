import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);

export {Device};
