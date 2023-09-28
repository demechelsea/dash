import { BaseModel } from './base';

export class SignatureDTO extends BaseModel {
  employeeId: number;
  signature: BinaryData;
}
