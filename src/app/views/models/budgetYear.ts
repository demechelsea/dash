import { AuditObjectDTO } from './auditObject';
import { BaseModel } from './base';

export class BudgetYear extends BaseModel {
  year: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}
