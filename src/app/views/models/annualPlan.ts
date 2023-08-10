import { RistScoreDTO } from "./RiskScoreDTO";
import { AuditUniverseDTO } from "./auditUniverse";
import { BaseModel } from "./base";

export interface AnnualPlanDTO extends BaseModel {
    name: string;
    description: string;
    year: string;
    riskLevel : string;
    riskScore : number;
    status : number;
    auditUniverse : AuditUniverseDTO;
    riskScores : RistScoreDTO[];
}