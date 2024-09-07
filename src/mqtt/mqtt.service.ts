import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as mqtt from 'mqtt';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';

@Injectable()
export class MqttService {
  private client;

  constructor(private sequelize: Sequelize) {
    this.client = mqtt.connect('mqtt://broker.emqx.io', {
      username: 'emqx',
      password: '12345678',
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('mcu8266/tmp');
      this.client.subscribe('esp8266/led');
      this.client.subscribe('esp8266/fan');
    });

    this.client.on('message', (topic, message) => {
      if (topic === 'mcu8266/tmp') {
        this.handleSensorData(message.toString());
      } else if (topic === 'esp8266/led' || topic === 'esp8266/fan') {
        this.logFanLightAction(topic, message.toString());
      }
    });
  }

  async handleSensorData(payload: string) {
    try {
      const data = JSON.parse(payload);

      const { temperature, humidity, Light } = data;
      const light = parseInt(Light, 10);


      if (temperature != null && humidity != null && Light != null) {
        await this.sequelize.getRepository(SensorData).create({
          temperature,
          humidity,
          light,
        });
        console.log('Data inserted successfully:', { temperature, humidity, light });
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

    // Lưu dữ liệu vào cơ sở dữ liệu
    await FanLightLog.create({
      device: device.substring(8),
      state: state, // Lưu hành động bật/tắt
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

  controlDevice(device: 'led' | 'fan', action: 'on' | 'off') {
    const topic = `esp8266/${device}`;
    this.client.publish(topic, action);
  }

  
}
