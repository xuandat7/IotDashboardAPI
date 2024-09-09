import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';


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

  @Column
  timestamp: Date;
}
