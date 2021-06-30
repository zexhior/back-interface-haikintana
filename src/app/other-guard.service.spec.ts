import { TestBed } from '@angular/core/testing';

import { OtherGuardService } from './other-guard.service';

describe('OtherGuardService', () => {
  let service: OtherGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
