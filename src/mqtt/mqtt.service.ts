import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as mqtt from 'mqtt';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';
import moment from 'moment-timezone';

@Injectable()
export class MqttService {
  private client;
  private deviceConnected = false;
  private deviceStates = {
    led: 'off',  // Mock state for LED
    fan: 'off', // Mock state for Fan
    tem: 'off', // Mock state for Tem
  };

  constructor(private sequelize: Sequelize) {
    this.client = mqtt.connect('mqtt://broker.emqx.io', {
      username: 'emqx',
      password: 'Xuandat1106',
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to the necessary topics
      this.client.subscribe('mcu8266/tmp');
      this.client.subscribe('esp8266/led');
      this.client.subscribe('esp8266/fan');
      this.client.subscribe('esp8266/tem');
      this.client.subscribe('esp8266/status');

    });

    this.client.publish('esp8266/status', 'disconnected');

    this.client.on('message', (topic, message) => {
      this.client.publish('esp8266/status', 'connected');
      if (topic === 'mcu8266/tmp') {
        this.handleSensorData(message.toString());
        
      } else if (topic === 'esp8266/led' || topic === 'esp8266/fan' || topic === 'esp8266/tem') {
        this.logFanLightAction(topic, message.toString());
        this.client.publish('esp8266/status', 'connected');
      } else if (topic === 'esp8266/status') {
        if (message.toString() === 'connected') {
          this.deviceConnected = true;
        } else if (message.toString() === 'disconnected') {
          this.deviceConnected = false;
        }
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
  
    const topic = `esp8266/${device}`;
    
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

      const { temperature, humidity, Light, createdAt } = data;
      const light = parseInt(Light, 10);

      if (temperature != null && humidity != null && Light != null) {
        await this.sequelize.getRepository(SensorData).create({
          temperature,
          humidity,
          light,
          createdAt: moment().utc().toDate()
        });
        console.log('Data inserted successfully:', {
          temperature,
          humidity,
          light,
        });
      } else {
        console.error('Invalid sensor data:', { temperature, humidity, light });
      }
    } catch (error) {
      console.error('Error inserting sensor data:', error);
    }
  }


  async logFanLightAction(device: string, state: string) {
    const currentTimestamp = new Date(); // Lấy thời gian hiện tại

    // Kiểm tra giá trị của state để chắc chắn không bị null
    if (!state) {
      throw new Error('State is null or undefined');
    }
    if(state == 'on' || state == 'off'){
      await FanLightLog.create({
        device: device.substring(8),
        state, // Lưu hành động bật/tắt
        timestamp: currentTimestamp,
      });
  
      // Trả về phản hồi thành công
      return {
        message: `Device ${device} turned ${state}`,
        device,
        state,
        timestamp: currentTimestamp,
      };
    }
    // Lưu dữ liệu vào cơ sở dữ liệu
    
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

  //get fan-light-log data by device
  async getFanLightLogDataByDevice(device: string): Promise<FanLightLog[]> {
    try {
      const logs = await FanLightLog.findAll({
        where: {
          device,
        },
      });
      return logs;
    } catch (error) {
      console.error('Error fetching fan light log data by device:', error);
      throw error;
    }
  }

  //get fan-light-log data by time
  async getFanLightLogDataByTime(from: Date, to: Date): Promise<FanLightLog[]> {
    try {
      const logs = await FanLightLog.findAll({
        where: {
          timestamp: {
            [Op.between]: [from, to],
          },
        },
      });
      return logs;
    } catch (error) {
      console.error('Error fetching fan light log data by time:', error);
      throw error;
    }
  }

  //get data by id
  async getFanLightLogById(id: number): Promise<FanLightLog> {
    try {
      const log = await FanLightLog.findByPk(id);
      if (!log) {
        throw new Error('Log not found');
      }
      return log;
    } catch (error) {
      console.error('Error fetching fan light log by id:', error);
      throw error;
    }
  }

  
}