import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as mqtt from 'mqtt';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';
import * as moment from 'moment-timezone';

@Injectable()
export class MqttService {
  private client;
  private deviceConnected = false;
  private deviceStates = {
    led: 'off',  // Mock state for LED
    fan: 'off', // Mock state for Fan
    tem: 'off', // Mock state for Tem
  };
  private latestWindSpeed: number = 0;

  constructor(private sequelize: Sequelize) {
    this.client = mqtt.connect('mqtt://broker.emqx.io', {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      rejectUnauthorized: true,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to the necessary topics
      this.client.subscribe('mcu8266/tmp');
      this.client.subscribe('datesp8266/led');
      this.client.subscribe('datesp8266/fan');
      this.client.subscribe('datesp8266/tem');
      this.client.subscribe('esp8266/wind');
      this.client.subscribe('esp8266/status');
      this.deviceConnected = true;

    });

    

    this.client.on('message', (topic, message) => {
      
      if (topic === 'mcu8266/tmp') {
        this.handleSensorData(message.toString());
        
      } else if (topic === 'datesp8266/led' || topic === 'datesp8266/fan' || topic === 'datesp8266/tem') {
        this.logFanLightAction(topic, message.toString());

      } else if (topic === 'esp8266/status') {
        if (message.toString() === 'connected') {
          this.deviceConnected = true;
        } else if (message.toString() === 'disconnected') {
          this.deviceConnected = false;
        }
      }
      else if (topic === 'esp8266/wind') {
        this.latestWindSpeed = parseFloat(message.toString());
        // console.log('Wind speed:', message.toString());

      }
     
      
    });
  }

  getDeviceState(device: 'led' | 'fan' | 'tem'): string {
    return this.deviceStates[device];
  }

  async getDeviceStatus() {
    if (this.deviceConnected) {
      return { status: 'connected' };
    } else {
      return { status: 'disconnected' };
    }
  }
  
  async controlDevice(device: 'led' | 'fan' | 'tem', action: 'on' | 'off') {
    if (!this.deviceConnected) {
      console.log(`Cannot control ${device}. Device is disconnected.`);
      return {
        message: `Device is disconnected. Cannot perform action on ${device}.`,
        success: false,
      };
    }
  
    const topic = `datesp8266/${device}`;
    
    // Publish action to MQTT broker
    this.client.publish(topic, action);
  
    // Lắng nghe thông điệp trả về từ broker để kiểm tra
    this.client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic && message.toString() === action) {
        this.deviceStates[device] = action;  // Cập nhật trạng thái thiết bị
        console.log(`Received correct confirmation for ${device}: ${action}`);
      }
    });
  
    console.log(`Sent command to ${device}: ${action}`);
    return {
      message: `Successfully sent ${action} command to ${device}.`,
      success: true,
    };
  }
  
  async handleSensorData(payload: string) {
    try {
      const data = JSON.parse(payload);
      // console.log(data);     
      const { temperature, humidity, Light, windSpeed } = data;
      const light = parseInt(Light, 10);

      if (temperature != null && humidity != null && Light != null) {
        await this.sequelize.getRepository(SensorData).create({
          temperature,
          humidity,
          light,
          createdAt: moment().utc().toDate(),
          windSpeed
        });
        console.log('Data inserted successfully:', {
          temperature,
          humidity,
          light,
          windSpeed
        });
      } else {
        console.error('Invalid sensor data:', { temperature, humidity, light });
      }
    } catch (error) {
      console.error('Error inserting sensor data:', error);
    }
  }


  async logFanLightAction(device: string, state: string) {
    // Get the current timestamp in UTC
    const currentTimestamp = moment().utc().toDate();
  
    // Ensure the state is not null or undefined
    if (!state) {
      throw new Error('State is null or undefined');
    }
  
    // Only log if the state is 'on' or 'off'
    if (state === 'on' || state === 'off') {
      // Create a new log entry in the FanLightLog table
      const deviceName = device.split('/')[1];
      await this.sequelize.getRepository(FanLightLog).create({
        device: deviceName,
        state,
        timestamp: currentTimestamp, // Save timestamp in UTC
      });
  
      // Return a success response
      return {
        message: `Device ${device} turned ${state}`,
        device,
        state,
        timestamp: moment.tz(currentTimestamp, 'Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
      };
    }
  
    // Throw an error if the state is not 'on' or 'off'
    throw new Error('Invalid state. Only "on" or "off" are allowed.');
  }
  

  async getFanLightLogData(
    page: number,
    limit: number,
  ): Promise<{ rows: FanLightLog[]; count: number }> {
    try {
      const offset = (page - 1) * limit;
      const { rows, count } = await FanLightLog.findAndCountAll({
        offset,
        limit,
      });
      return { rows, count };
    } catch (error) {
      console.error('Error fetching fan light log data:', error);
      throw error;
    }
  }

  //get wind speed from topic 'esp8266/wind'
  getLatestWindSpeed(): number {
    return this.latestWindSpeed;
  }

  
  
}