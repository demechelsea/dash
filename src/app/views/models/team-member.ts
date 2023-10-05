import { UserDTO } from "./userDTO";
import { AuditScheduleDTO } from "./auditSchedule";
import { BaseModel } from "./base";

export class TeamMemberDTO extends BaseModel {
    auditSchedule: AuditScheduleDTO;
    status: string;
    user: UserDTO;
    teamMemberStatus: string;
    teamType: string;
    auditStatus: string;
    perdium: number;

}
