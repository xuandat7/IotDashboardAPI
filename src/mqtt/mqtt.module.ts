import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MqttService } from './mqtt.service';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';
import { DeviceStatusService } from '../service/device-status.service';

@Module({
  imports: [SequelizeModule.forFeature([SensorData, FanLightLog])],
  providers: [MqttService, DeviceStatusService],
  exports: [MqttService, DeviceStatusService],
})
export class MqttModule {}
