import { Injectable } from '@nestjs/common';
import { MqttClient } from 'mqtt';

@Injectable()
export class DeviceControlService {
  private client: MqttClient;
  private deviceStates: { [key: string]: string } = {};
  private deviceConnected: boolean = true;  // Assume device is connected initially

  constructor(client: MqttClient) {
    this.client = client;
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

  setDeviceConnected(status: boolean) {
    this.deviceConnected = status;
  }

  getDeviceStates() {
    return this.deviceStates;
  }
}
