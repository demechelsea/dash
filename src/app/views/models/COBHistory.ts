export interface COBHistoryDTO  {
    id: number;
    earliestJTAnalyzed: string;
    latestJTAnalyzed: string;
    totalJTAnalyzed: number;
    fastestCOBElapsedTime: string;
    averageCOBElapsedTime: string;
    slowestCOBElapsedTime: string;
    totalCOBElapsedTime: string;
}
