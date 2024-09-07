import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MqttModule } from './mqtt/mqtt.module';
import { SensorData } from './model/sensor-data.model';
import { FanLightLog } from './model/fan-light-log.model';
import { DevicesController } from './controller/devices.controller';
import { GetDataActionController } from './controller/getdata.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'esp8266',
      autoLoadModels: true,
      synchronize: true,
      logging: console.log,
    }),
    SequelizeModule.forFeature([SensorData, FanLightLog]),
    MqttModule,
  ],
  controllers: [DevicesController, GetDataActionController],
})
export class AppModule {}
