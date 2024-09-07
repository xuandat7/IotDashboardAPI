import { Controller, Post, Param } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('devices')
@Controller('devices')
export class DevicesController {
    constructor(private readonly mqttService: MqttService) {}

    @ApiOperation({ summary: 'Control device' })
    @ApiResponse({ status: 200, description: 'Device controlled successfully' })
    @Post(':device/:action')
    controlDevice(
        @Param('device') device: 'led' | 'fan',
        @Param('action') action: 'on' | 'off',
    ) {
        this.mqttService.controlDevice(device, action);
        return { message: `${device} turned ${action}` };
    }
}