import { Controller, Post, Param, Get } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FanLightLog } from 'src/model/fan-light-log.model';




@ApiTags('getDataActionHistory')
@Controller('GetDataAction')
export class GetDataActionController {
    constructor(private readonly mqttService: MqttService) {}

    @ApiOperation({ summary: 'Get history action data' })
    @ApiResponse({ status: 200, description: 'Fan light log data retrieved successfully' })
    @Get('fanlightlog')
    async getFanLightLogData(): Promise<FanLightLog[]> {
        return await this.mqttService.getFanLightLogData();
    }


    //get all action data by name
    @ApiOperation({ summary: 'Get history action data by device' })
    @ApiResponse({ status: 200, description: 'Fan light log data retrieved successfully' })
    @Get('fanlightlog/:device')
    async getFanLightLogDataByDevice(
        @Param('device') device: string,
    ): Promise<FanLightLog[]> {
        return await this.mqttService.getFanLightLogDataByDevice(device);
    }

    //get all action data by time
    @ApiOperation({ summary: 'Get history action data by date range' })
    @ApiResponse({ status: 200, description: 'Fan light log data retrieved successfully' })
    @ApiParam({ name: 'from', description: 'Start date', type: 'string', format: 'date' })
    @ApiParam({ name: 'to', description: 'End date', type: 'string', format: 'date' })
    @Get(':from/:to')
    async getFanLightLogDataByTime(
        @Param('from') from: string,  // Nhận từ người dùng dưới dạng chuỗi
        @Param('to') to: string,      // Nhận từ người dùng dưới dạng chuỗi
    ): Promise<FanLightLog[]> {
        const startDate = new Date(from);  // Chuyển chuỗi thành kiểu Date
        const endDate = new Date(to);      // Chuyển chuỗi thành kiểu Date
        return await this.mqttService.getFanLightLogDataByTime(startDate, endDate);
    }


}
