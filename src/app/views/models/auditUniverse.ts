import { BaseModel } from "./base";

export class AuditUniverseDTO extends BaseModel {
    name: string;
    description: string;
    type: string;
    status : string;
}
