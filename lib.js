import aws from 'aws-iot-device-sdk';
import dotenv from 'dotenv';
import { Device } from './models/deviceModel.js';
import { DeviceData } from './models/deviceDataModel.js';  // Changed from SensorData
import mongoose from 'mongoose';
import connectDB from './db/index.js';  // Changed from './config/db.js' to './db/index.js'

dotenv.config();

const device = aws.device({
    keyPath: process.env.AWS_IOT_PRIVATE_KEY,
    certPath: process.env.AWS_IOT_CERTIFICATE,
    caPath: process.env.AWS_IOT_ROOT_CA,
    clientId: process.env.AWS_IOT_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT
});

const generateRandomTemp = () => {
    return (20 + (Math.random() * 4 - 2)).toFixed(1);
};

const generateRandomHumidity = () => {
    return (96 + (Math.random() * 4 - 2)).toFixed(1);
};

// Hardcoded device information
const HARDCODED_DEVICE = {
    _id: "675c7974f8397f0e0aa546b3",
    deviceName: "Device001",
    user: "675beb4a5b3142b487500575"
};

const saveDeviceData = async (payload) => {
    try {
        // Create new device data entry with hardcoded device ID
        const deviceData = await DeviceData.create({
            device: HARDCODED_DEVICE._id,
            // Use original values if they exist and are non-zero, otherwise use random values
            temperature: payload.temperature && payload.temperature !== 0 
                ? payload.temperature 
                : generateRandomTemp(),
            humidity: payload.humidity && payload.humidity !== 0 
                ? payload.humidity 
                : generateRandomHumidity(),
            location: {
                latitude: payload.latitude || 13.339168,  // Default latitude for Delhi
                longitude: payload.longitude || 7.113998  // Default longitude for Delhi
            }
        });

        // Update lastActive timestamp for the hardcoded device
        await Device.findByIdAndUpdate(HARDCODED_DEVICE._id, {
            lastActive: new Date()
        });

        console.log('✅ Data saved to database:', {
            deviceId: HARDCODED_DEVICE._id,
            deviceName: HARDCODED_DEVICE.deviceName,
            deviceDataId: deviceData._id,
            temperature: deviceData.temperature,
            humidity: deviceData.humidity,
            location: deviceData.location
        });
    } catch (error) {
        console.error('❌ Database save error:', error);
    }
};

export const initializeAWSIoT = () => {
    device.on('connect', () => {
        console.log('Connected to AWS IoT Core');
        device.subscribe(process.env.MQTT_TOPIC);
        console.log(`Subscribed to topic: ${process.env.MQTT_TOPIC}`);
    });

    device.on('message', async (topic, payload) => {
        try {
            console.log('----------------------------------------');
            console.log(`Topic: ${topic}`);
            console.log('Timestamp:', new Date().toISOString());
            const data = JSON.parse(payload.toString());
            console.log('Payload:', data);
            console.log('----------------------------------------');
            
            if (topic === process.env.MQTT_TOPIC) {
                await saveDeviceData(data);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    device.on('error', (error) => {
        console.error('AWS IoT Error:', error);
    });
};
