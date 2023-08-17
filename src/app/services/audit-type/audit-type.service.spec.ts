import { TestBed } from '@angular/core/testing';

import { AnnualPlanService } from './audit-type.service';

describe('AnnualPlanService', () => {
  let service: AnnualPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
