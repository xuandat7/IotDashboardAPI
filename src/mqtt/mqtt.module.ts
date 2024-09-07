import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MqttService } from './mqtt.service';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';

@Module({
  imports: [SequelizeModule.forFeature([SensorData, FanLightLog])],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
