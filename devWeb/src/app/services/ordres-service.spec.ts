import { TestBed } from '@angular/core/testing';

import { OrdresService } from './ordres-service';

describe('OrdresService', () => {
  let service: OrdresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
