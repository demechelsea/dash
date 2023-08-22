import { DailyHistoryDTO } from "./dailyHistory";
import { BaseModel } from "./base";

export class JTHistoryWithAverageCOBTime extends BaseModel {
    averageCOBTime: string;
    dailyHistoryList : DailyHistoryDTO[];
}
