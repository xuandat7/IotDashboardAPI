import { Controller, Get } from '@nestjs/common';
import { DeviceStatusService } from '../service/device-status.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('deviceStatus')
export class DeviceStatusController {
  constructor(private readonly deviceStatusService: DeviceStatusService) {}
  @ApiTags('devices status')
  @Get('device-status')
  @ApiOperation({ summary: 'Get the status of all devices' })
  @ApiResponse({ status: 200, description: 'Device status fetched successfully' })
  getDeviceStatus() {
    return this.deviceStatusService.getStatus();
  }
}
