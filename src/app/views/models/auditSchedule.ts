import { AnnualPlanDTO } from "./annualPlan";
import { AuditEngagementDTO } from "./audit-engagement";
import { TeamMemberDTO } from "./team-member";
import { BaseModel } from "./base";

export class AuditScheduleDTO extends BaseModel {
    startOn: string;
    endOn: string;
    status: string;
    auditEngagement : AuditEngagementDTO;
    teamMembers : TeamMemberDTO[];
    annualPlan : AnnualPlanDTO;
}
