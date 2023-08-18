import { BaseModel } from "./base";

export class AuditUniverseDTO extends BaseModel {
    name: string;
    description: string;
    auditType: string;
    status : string;
}
