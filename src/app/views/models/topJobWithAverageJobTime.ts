import { JobHistoryDTO } from "./jobHistoryDTO";
import { BaseModel } from "./base";

export class TopJobWithAverageJobTime extends BaseModel {
    averageJobElapsedTime: JobHistoryDTO[];
    jobHistoryList : JobHistoryDTO[];
}
