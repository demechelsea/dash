import { TestBed } from '@angular/core/testing';

import { AuditPlanService } from './audit-type.service';

describe('AuditPlanService', () => {
  let service: AuditPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
