import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MqttService } from '../mqtt/mqtt.service';

@ApiTags('ESP8266')
@Controller('esp8266')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @ApiOperation({ summary: 'Get device status' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved device status',
  })
  @Get('status')
  async getDeviceStatus() {
    return this.mqttService.getDeviceStatus();
  }
  // Other methods...
}
