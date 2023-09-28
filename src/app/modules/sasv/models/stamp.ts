import { BaseModel } from './base';

export class StampDTO extends BaseModel {
  organizationUnitId: number;
  subProcessId: number;
  processId: number;
  stamp: BinaryData;
}

