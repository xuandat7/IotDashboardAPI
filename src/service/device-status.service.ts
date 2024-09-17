import { Injectable } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service'; // Assuming you have an MqttService to handle MQTT logic

@Injectable()
export class DeviceStatusService {
  constructor(private readonly mqttService: MqttService) {}

  // Simulating device status and connection check.
  getStatus() {
    // For simplicity, we're using static values.
    // In a real scenario, fetch these from MQTT topics, a database, or directly from devices.
    const ledStatus = this.mqttService.getDeviceState('led'); // Fetches the 'led' state from MQTT
    const fanStatus = this.mqttService.getDeviceState('fan'); // Fetches the 'fan' state from MQTT
    const temStatus = this.mqttService.getDeviceState('tem'); // Fetches the 'fan' state from MQTT

    return {
      led: {
        state: ledStatus || 'off',  // Default to 'off' if no data
        connected: ledStatus !== null, // Assuming null means disconnected
      },
      fan: {
        state: fanStatus || 'off',  // Default to 'off' if no data
        connected: fanStatus !== null, // Assuming null means disconnected
      },
      tem: {
        state: temStatus || 'off',  // Default to 'off' if no data
        connected: temStatus !== null, // Assuming null means disconnected
      },
    };
  }
}
