import { Controller, Post, Param, Get } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly mqttService: MqttService) {}

  @ApiOperation({ summary: 'Control device' })
  @ApiResponse({ status: 200, description: 'Device controlled successfully' })
  @ApiResponse({ status: 400, description: 'Device is disconnected' })
  @Post(':device/:action')
  async controlDevice(
    @Param('device') device: 'led' | 'fan',
    @Param('action') action: 'on' | 'off',
  ) {
    // Kiểm tra trạng thái kết nối của thiết bị
    const deviceStatus = await this.mqttService.getDeviceStatus();

    if (deviceStatus.status === 'disconnected') {
      return {
        statusCode: 400,
        message: `Cannot control ${device}. Device is disconnected.`,
      };
    }

    // Điều khiển thiết bị nếu đã kết nối
    const result = this.mqttService.controlDevice(device, action);

    return {
      statusCode: 200,
      message: result.message,
      success: result.success,
    };
  }
  
}
