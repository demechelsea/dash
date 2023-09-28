import { BaseModel } from "./base";
import { OrganizationalUnit } from "./organizationalunit";

export class Employee extends BaseModel {
    id: number;
    employeeId: number;
    fullName: string;
    jobTitle : string;
    organizationalUnit:OrganizationalUnit;
    phoneNumber: string;
    personalEmail:string;
    companyEmail: string;
    gender: string;
    birthDate: string;
    employeeImage: string;
    signatureImage: string;
    active: boolean;
}
