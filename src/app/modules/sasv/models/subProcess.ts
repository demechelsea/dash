import { BaseModel } from "./base";
import { Process } from "./process";

export class SubProcess extends BaseModel {
    id: number;
    code: string;
    name : string;  
    process: Process;
}

