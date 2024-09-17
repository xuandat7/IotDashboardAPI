import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as mqtt from 'mqtt';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';

@Injectable()
export class MqttService {
  private client;
  private deviceConnected = false;
  private deviceStates = {
    led: 'off',  // Mock state for LED
    fan: 'off', // Mock state for Fan
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
      this.client.subscribe('esp8266/status'); // Subscribe to the new status topic
      this.client.subscribe('device/led/state');
      this.client.subscribe('device/fan/state');
    });

    this.client.publish('esp8266/status', 'disconnected');

    this.client.on('message', (topic, message) => {
      this.client.publish('esp8266/status', 'connected');
      if (topic === 'mcu8266/tmp') {
        this.handleSensorData(message.toString());
        this.client.publish('esp8266/status', 'connected');
      } else if (topic === 'esp8266/led' || topic === 'esp8266/fan') {
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

  getDeviceState(device: 'led' | 'fan'): string {
    return this.deviceStates[device];
  }

  async getDeviceStatus() {
    if (this.deviceConnected) {
      return { status: 'connected' };
    } else {
      return { status: 'disconnected' };
    }
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
          createdAt,
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

  controlDevice(device: 'led' | 'fan', action: 'on' | 'off') {
    if (!this.deviceConnected) {
      console.log(`Cannot control ${device}. Device is disconnected.`);
      return {
        message: `Device is disconnected. Cannot perform action on ${device}.`,
        success: false,
      };
    }

    const topic = `esp8266/${device}`;
    this.client.publish(topic, action);
    this.deviceStates[device] = action;
    console.log(`Sent command to ${device}: ${action}`);
    return {
      message: `Successfully sent ${action} command to ${device}.`,
      success: true,
    };
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

  //get all sensor data
  async getAllSensorData(
    page: number,
    limit: number,
  ): Promise<{ rows: SensorData[]; count: number }> {
    try {
      const offset = (page - 1) * limit;
      const { rows, count } = await SensorData.findAndCountAll({
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });
      return { rows, count };
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  //get all sensor data by time
  async getSensorDataByTime(from: Date, to: Date): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching sensor data by time:', error);
      throw error;
    }
  }

  //get sensor data by id
  async getSensorDataById(id: number): Promise<SensorData> {
    try {
      const data = await SensorData.findByPk(id);
      if (!data) {
        throw new Error('Data not found');
      }
      return data;
    } catch (error) {
      console.error('Error fetching sensor data by id:', error);
      throw error;
    }
  }

  //get sensor data by lower than x temperature

  async getSensorDataByTemperatureLowerThan(
    temperature: number,
  ): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          temperature: {
            [Op.lt]: temperature,
          },
        },
      });
      return data;
    } catch (error) {
      console.error(
        'Error fetching sensor data by temperature lower than:',
        error,
      );
      throw error;
    }
  }

  //get sensor data by greater than x temperature
  async getSensorDataByTemperatureGreaterThan(
    temperature: number,
  ): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          temperature: {
            [Op.gt]: temperature,
          },
        },
      });
      return data;
    } catch (error) {
      console.error(
        'Error fetching sensor data by temperature lower than:',
        error,
      );
      throw error;
    }
  }

  //get sensor data by temperature in range
  async getSensorDataByTemperatureInRange(
    min: number,
    max: number,
  ): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          temperature: {
            [Op.between]: [min, max],
          },
        },
      });
      return data;
    } catch (error) {
      console.error(
        'Error fetching sensor data by temperature in range:',
        error,
      );
      throw error;
    }
  }

  //get sensor data lower than x humidity
  async getSensorDataByHumidityLowerThan(
    humidity: number,
  ): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          humidity: {
            [Op.lt]: humidity,
          },
        },
      });
      return data;
    } catch (error) {
      console.error(
        'Error fetching sensor data by humidity lower than:',
        error,
      );
      throw error;
    }
  }

  // get sensor data greater than x humidity
  async getSensorDataByHumidityGreaterThan(
    humidity: number,
  ): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          humidity: {
            [Op.gt]: humidity,
          },
        },
      });
      return data;
    } catch (error) {
      console.error(
        'Error fetching sensor data by humidity greater than:',
        error,
      );
      throw error;
    }
  }

  // get sensor data by humidity in range
  async getSensorDataByHumidityInRange(
    min: number,
    max: number,
  ): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          humidity: {
            [Op.between]: [min, max],
          },
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching sensor data by humidity in range:', error);
      throw error;
    }
  }

  //get sensor data lower than x light
  async getSensorDataByLightLowerThan(light: number): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          light: {
            [Op.lt]: light,
          },
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching sensor data by light lower than:', error);
      throw error;
    }
  }

  //get sensor data greater than x light
  async getSensorDataByLightGreaterThan(light: number): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          light: {
            [Op.gt]: light,
          },
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching sensor data by light greater than:', error);
      throw error;
    }
  }

  //get sensor data by light in range
  async getSensorDataByLightInRange(
    min: number,
    max: number,
  ): Promise<SensorData[]> {
    try {
      const data = await SensorData.findAll({
        where: {
          light: {
            [Op.between]: [min, max],
          },
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching sensor data by light in range:', error);
      throw error;
    }
  }
}
