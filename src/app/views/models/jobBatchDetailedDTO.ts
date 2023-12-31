import { BaseModel } from "./base";

export class JobBatchDetailedDTO extends BaseModel {
    jobId: string;
    batchId: string;
    jobName: string;
    batchName : string;
    batchStageName : string;
    stageName : string;
    averageElapsedTime : string;
    minimumElapsedTime : string;
    maximumElapsedTime : string;
    percentageIncrease : number
}

