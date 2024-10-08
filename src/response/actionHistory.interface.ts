import { FanLightLog } from "src/model/fan-light-log.model";

export interface FanLightLogResponse {
  columns: string[];
  rows: FanLightLog[];
  count: number;
  page: number;
  limit: number;
}