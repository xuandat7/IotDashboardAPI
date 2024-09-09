import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
    type: DataType.DATE
  })
  createdAt: Date;

}
