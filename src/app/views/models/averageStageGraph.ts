import { StageHistory } from "./stageHistory";
import { BaseModel } from "./base";

export class StageHistoryWithAverageStageTime  extends BaseModel {
    averageStageElapsedTime: StageHistory[];
    stageHistoryList : StageHistory[];
}
