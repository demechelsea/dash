import { AuditObjectDTO } from "./auditObject";
import { AuditableAreasDTO } from "./auditableAreas";
import { BaseModel } from "./base";

export interface CkeckListItemDTO extends BaseModel {
    name: string;
    auditObjectDTO: AuditObjectDTO;
    auditableArea : AuditableAreasDTO;
}
