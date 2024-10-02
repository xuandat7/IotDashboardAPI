import { Controller, Get } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';

@Controller('wind')
export class WindController {
  constructor(private mqttService: MqttService) {}

  @Get('now')
  getWindSpeed() {
    const windSpeed = this.mqttService.getLatestWindSpeed();
    return { windSpeed };
  }
}