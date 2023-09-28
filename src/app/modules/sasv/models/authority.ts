import { BaseModel } from "./base";
import { Employee } from "./employee";
import { OrganizationalUnit } from "./organizationalunit";
import { Process } from "./process";
import { SubProcess } from "./subProcess";

export class AuthorityDTO extends BaseModel {
    employee: Employee;
    organizationalUnit: OrganizationalUnit;
    subProcess: SubProcess;
    process : Process;
    createdAt : string;
    updatedAt : string;
    status : string;

}

