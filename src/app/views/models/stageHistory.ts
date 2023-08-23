import { DailyHistoryDTO } from "./dailyHistory";
import { StageDTO } from "./stages";

export interface StageHistory  {
    id: string;
    startTime: string;
    endTime: string;
    elapsedTime: string;
    totalCompletedBatchStages: number;
    stage: StageDTO;
    dailyHistory: DailyHistoryDTO;
}
