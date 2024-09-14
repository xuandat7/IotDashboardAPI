import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SensorDataResponse } from 'src/response/sensorData.interface';

@ApiTags('Sensor')
@Controller('SensorData')
export class getSensorDataController {
    constructor(private readonly mqttService: MqttService) {}

    // get all sensor data
    @Get()
    @ApiOperation({ summary: 'Get all sensor data' })
    @ApiResponse({ status: 200, description: 'Success' })
    async getAllSensorData(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ): Promise<SensorDataResponse> {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const { rows, count } = await this.mqttService.getAllSensorData(pageNumber, limitNumber);
        return {
            columns: ["id", "temperature", "humidity", "light", "timestamp"],
            rows,
            count,
            page: pageNumber,
            limit: limitNumber,
        };
        
    }

    // get sensor data by time
    @Get('/datetime/:from/:to')
    @ApiOperation({ summary: 'Get sensor data by date' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'from', description: 'Start date', type: 'string', format: 'date', example: '08/09/2024' })
    @ApiParam({ name: 'to', description: 'End date', type: 'string', format: 'date', example: '09/09/2024' })
    async getSensorDataByTime(
        @Param('from') from: string,
        @Param('to') to: string,
    ) {
        const startDate = new Date(from);
        const endDate = new Date(to);
        return this.mqttService.getSensorDataByTime(startDate, endDate);
    }

    //get sensor data by id
    @Get('/id/:id')
    @ApiOperation({ summary: 'Get sensor data by id' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'id', description: 'Sensor data id', type: 'number' })
    async getSensorDataById(
        @Param('id') id: number,
    ) {
        return this.mqttService.getSensorDataById(id);
    }

    //get sensor data lower than x temperature
    @Get('temperatureLower/:temperature')
    @ApiOperation({ summary: 'Get sensor data lower than temperature' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'temperature', description: 'Temperature', type: 'number' })
    async getSensorDataByTemperatureLowerThan(
        @Param('temperature') temperature: number,
    ) {
        return this.mqttService.getSensorDataByTemperatureLowerThan(temperature);
    }

    //get sensor data greater than x temperature
    @Get('temperatureGreater/:temperature')
    @ApiOperation({ summary: 'Get sensor data greater than temperature' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'temperature', description: 'Temperature', type: 'number' })
    async getSensorDataByTemperatureGreaterThan(
        @Param('temperature') temperature: number,
    ) {
        return this.mqttService.getSensorDataByTemperatureGreaterThan(temperature);
    }

    //get sensor data by temperature in range
    @Get('temperatureRange/:from/:to')
    @ApiOperation({ summary: 'Get sensor data by temperature range' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'from', description: 'Start temperature', type: 'number' })
    @ApiParam({ name: 'to', description: 'End temperature', type: 'number' })
    async getSensorDataByTemperatureRange(
        @Param('from') from: number,
        @Param('to') to: number,
    ) {
        return this.mqttService.getSensorDataByTemperatureInRange(from, to);
    }

    

    //get sensor data lower than x humidity
    @Get('humidityLower/:humidity')
    @ApiOperation({ summary: 'Get sensor data lower than humidity' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'humidity', description: 'Humidity', type: 'number' })
    async getSensorDataByHumidityLowerThan(
        @Param('humidity') humidity: number,
    ) {
        return this.mqttService.getSensorDataByHumidityLowerThan(humidity);
    }

    //get saensor data greater than x humidity
    @Get('humidityGreater/:humidity')
    @ApiOperation({ summary: 'Get sensor data greater than humidity' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'humidity', description: 'Humidity', type: 'number' })
    async getSensorDataByHumidityGreaterThan(
        @Param('humidity') humidity: number,
    ) {
        return this.mqttService.getSensorDataByHumidityGreaterThan(humidity);
    }

    //get sensor data by humidity in range
    @Get('humidityRange/:from/:to')
    @ApiOperation({ summary: 'Get sensor data by humidity range' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'from', description: 'Start humidity', type: 'number' })
    @ApiParam({ name: 'to', description: 'End humidity', type: 'number' })
    async getSensorDataByHumidityRange(
        @Param('from') from: number,
        @Param('to') to: number,
    ) {
        return this.mqttService.getSensorDataByHumidityInRange(from, to);
    }


    //get sensor data lower than x light
    @Get('lightLower/:light')
    @ApiOperation({ summary: 'Get sensor data lower than light' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'light', description: 'Light', type: 'number' })
    async getSensorDataByLightLowerThan(
        @Param('light') light: number,
    ) {
        return this.mqttService.getSensorDataByLightLowerThan(light);
    }

    //get sensor data greater than x light
    @Get('lightHigher/:light')
    @ApiOperation({ summary: 'Get sensor data greater than light' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'light', description: 'Light', type: 'number' })
    async getSensorDataByLightGreaterThan(
        @Param('light') light: number,
    ) {
        return this.mqttService.getSensorDataByLightGreaterThan(light);
    }

    // get sensor data by light in range
    @Get('lightRange/:from/:to')
    @ApiOperation({ summary: 'Get sensor data by light range' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiParam({ name: 'from', description: 'Start light', type: 'number' })
    @ApiParam({ name: 'to', description: 'End light', type: 'number' })
    async getSensorDataByLightRange(
        @Param('from') from: number,
        @Param('to') to: number,
    ) {
        return this.mqttService.getSensorDataByLightInRange(from, to);
    }




}
