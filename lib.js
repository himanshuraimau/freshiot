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

// Add these helper functions at the top
const generateRandomTemp = () => {
    // Generate temperature between 18 and 22 degrees
    return (20 + (Math.random() * 4 - 2)).toFixed(1);
};

const generateRandomHumidity = () => {
    // Generate humidity between 94 and 98 percent
    return (96 + (Math.random() * 4 - 2)).toFixed(1);
};

const saveDeviceData = async (payload) => {
    try {
        // Save to Device collection
        const deviceDoc = await Device.findOneAndUpdate(
            { deviceName: payload.device_id },
            {
                deviceName: payload.device_id,
                password: 'password123',
                status: 'active',  // Added status field
                lastActive: new Date()
            },
            { upsert: true, new: true }
        );

        // Save to DeviceData collection with simulated values
        const deviceData = await DeviceData.create({
            device: deviceDoc._id,  // Reference the device by _id
            temperature: generateRandomTemp(), // Use simulated temperature
            humidity: generateRandomHumidity(), // Use simulated humidity
            location: {
                latitude: payload.latitude,
                longitude: payload.longitude
            }
        });

        console.log('✅ Data saved to database:', {
            deviceId: deviceDoc._id,
            deviceDataId: deviceData._id,  // Changed from sensorDataId
            temperature: deviceData.temperature,
            humidity: deviceData.humidity
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
