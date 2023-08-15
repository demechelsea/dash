import { AuditObjectDTO } from "./auditObject";
import { AuditableAreasDTO } from "./auditableAreas";
import { BaseModel } from "./base";

export class CkeckListItemDTO extends BaseModel {
    name: string;
    auditObjectDTO: AuditObjectDTO;
    auditableAreaDTO : AuditableAreasDTO;
}
