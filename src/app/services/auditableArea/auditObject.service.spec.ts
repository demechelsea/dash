import { TestBed } from '@angular/core/testing';

import { AuditableAreasService } from './auditObject.service';

describe('AuditableAreasService', () => {
  let service: AuditableAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditableAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
