import aws from 'aws-iot-device-sdk';
import { Device } from './models/deviceModel.js';
import { SensorData } from './models/sensorData.js';
import dotenv from 'dotenv';

dotenv.config();

const device = aws.device({
    keyPath: process.env.AWS_IOT_PRIVATE_KEY,
    certPath: process.env.AWS_IOT_CERTIFICATE,
    caPath: process.env.AWS_IOT_ROOT_CA,
    clientId: process.env.AWS_IOT_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT
});

export const initializeAWSIoT = () => {
    device.on('connect', () => {
        console.log('Connected to AWS IoT Core');
        device.subscribe('device/data');
    });

    device.on('message', async (topic, payload) => {
        try {
            const data = JSON.parse(payload.toString());
            await updateDeviceData(data);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    device.on('error', (error) => {
        console.error('AWS IoT Error:', error);
    });

    // Start periodic data fetch every 5 minutes
    setInterval(fetchDeviceData, 5 * 60 * 1000);
};

const fetchDeviceData = () => {
    device.publish('device/request', JSON.stringify({
        action: 'getData',
        timestamp: new Date().toISOString()
    }));
};

const updateDeviceData = async (data) => {
    try {
        const { deviceName, temperature, humidity, latitude, longitude } = data;
        
        // Update current device state
        await Device.findOneAndUpdate(
            { deviceName },
            {
                temperature,
                humidity,
                location: { latitude, longitude },
                lastUpdated: new Date()
            },
            { upsert: true }
        );

        // Save historical data
        await SensorData.create({
            deviceName,
            temperature,
            humidity,
            location: { latitude, longitude }
        });
    } catch (error) {
        console.error('Error updating device data:', error);
    }
};
