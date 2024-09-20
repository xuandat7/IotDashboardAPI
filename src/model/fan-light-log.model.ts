import * as moment from 'moment-timezone';
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';


@Table({
  timestamps: false, 
  tableName: 'FanLightLog', // Tên bảng trong CSDL
})
export class FanLightLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  device: string;

  @Column
  state: string;

  @Column({
    type: DataType.DATE,
    get() {
      const time = this.getDataValue('timestamp');
      return moment.tz(time, 'Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    }
  })
  timestamp: Date;
}
