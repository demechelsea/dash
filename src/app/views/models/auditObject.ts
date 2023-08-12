import { AuditUniverseDTO } from "./auditUniverse";
import { BaseModel } from "./base";

export class AuditObjectDTO extends BaseModel {
    name: string;
    description: string;
    auditType: string;
    auditUniverse : AuditUniverseDTO;
}
