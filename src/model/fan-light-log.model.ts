import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';


@Table({
  timestamps: false, // Loại bỏ createdAt và updatedAt
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
  timestamp: Date; // Thêm cột timestamp để lưu thời gian thực
}
