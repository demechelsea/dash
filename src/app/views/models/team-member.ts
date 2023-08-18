import { UserDTO } from "./annualPlan copy";
import { AuditScheduleDTO } from "./auditSchedule";
import { BaseModel } from "./base";

export class TeamMemberDTO extends BaseModel {
    auditSchedule: AuditScheduleDTO;
    status: string;
    user: UserDTO;
    teamMemberStatus: string;
    teamType: string;

}
