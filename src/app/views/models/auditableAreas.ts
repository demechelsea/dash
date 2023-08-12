import { BaseModel } from "./base";

export interface AuditableAreasDTO extends BaseModel {
    name: string;
    description: string;
}