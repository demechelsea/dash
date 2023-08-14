import { AnnualPlanDTO } from "./annualPlan";
import { BaseModel } from "./base";

export interface RistScoreDTO extends BaseModel {
    riskItem: number ;
    annualPlan: AnnualPlanDTO;
    frequency: number;
    impact: number;
    total : number;
}

