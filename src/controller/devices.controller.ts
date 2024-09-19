import { Controller, Post, Param, Get } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly mqttService: MqttService) {}

  @ApiOperation({ summary: 'Control device' })
  @ApiResponse({ status: 200, description: 'Device command sent successfully' })
  @ApiResponse({ status: 400, description: 'Device is disconnected' })
  @Post(':device/:action')
  async controlDevice(
    @Param('device') device: 'led' | 'fan' | 'tem',
    @Param('action') action: 'on' | 'off',
  ) {
    // Check device connection status
    const deviceStatus = await this.mqttService.getDeviceStatus();

    if (deviceStatus.status === 'disconnected') {
      return {
        statusCode: 400,
        message: `Cannot control ${device}. Device is disconnected.`,
      };
    }

    // Send control command
    const result = this.mqttService.controlDevice(device, action);

    return {
      statusCode: 200,
      message: (await result).message,
      success: (await result).success,
    };
  }
}
