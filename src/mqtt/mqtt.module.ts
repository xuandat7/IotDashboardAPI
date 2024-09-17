import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MqttService } from './mqtt.service';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';
import { DeviceStatusService } from '../service/device-status.service';
import { SensorDataService } from 'src/service/sensor-data.service';
import { DeviceDataService } from 'src/service/device-data.service';

@Module({
  imports: [SequelizeModule.forFeature([SensorData, FanLightLog])],
  providers: [MqttService, DeviceStatusService, SensorDataService, DeviceDataService],
  exports: [MqttService, DeviceStatusService, SensorDataService, DeviceDataService],
})
export class MqttModule {}
