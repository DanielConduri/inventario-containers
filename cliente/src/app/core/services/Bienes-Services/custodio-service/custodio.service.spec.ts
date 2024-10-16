import { TestBed } from '@angular/core/testing';

import { CustodioService } from './custodio.service';

describe('CustodioService', () => {
  let service: CustodioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustodioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
