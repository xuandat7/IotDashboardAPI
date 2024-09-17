import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MqttService } from './mqtt.service';
import { SensorData } from '../model/sensor-data.model';
import { FanLightLog } from '../model/fan-light-log.model';
import { DeviceStatusService } from '../service/device-status.service';
import { DeviceDataService } from 'src/service/device-data.service';
import { SortService } from 'src/service/sort.service';
import { SearchService } from 'src/service/search.service';
import { PaginationService } from 'src/service/pagination.service';
import { SensorDataService } from 'src/service/sensor-data.service';

@Module({
  imports: [SequelizeModule.forFeature([SensorData, FanLightLog])],
  providers: [MqttService, DeviceStatusService, DeviceDataService, SortService, SearchService, PaginationService, SensorDataService],
  exports: [MqttService, DeviceStatusService, DeviceDataService, SortService, SearchService, PaginationService, SensorDataService],
})
export class MqttModule {}
