import { SensorData } from "src/model/sensor-data.model";

export interface SensorDataResponse {
  columns: string[];
  rows: SensorData[];
  count: number;
  page: number;
  limit: number;
}