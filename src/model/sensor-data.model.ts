import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ timestamps: false })  // Disable automatic timestamps
export class SensorData extends Model {
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  temperature: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  humidity: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  light: number;
}
