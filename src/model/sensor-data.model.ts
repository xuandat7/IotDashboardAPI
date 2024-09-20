import { Table, Column, Model, DataType } from 'sequelize-typescript';
import * as moment from 'moment-timezone';

@Table({ timestamps: false })
export class SensorData extends Model {
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  temperature: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  humidity: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  light: number;

  @Column({
    type: DataType.DATE,
    get() {
      const time = this.getDataValue('createdAt');
      return moment.tz(time, 'Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    }
  })
  createdAt: Date;
}