import { Employee } from 'src/app/modules/sasv/models/employee';
import { BaseModel } from './base';

export class UserDTO extends BaseModel {
    username: string;
    password: string;
    active: Boolean;
    employee: Employee;
}
