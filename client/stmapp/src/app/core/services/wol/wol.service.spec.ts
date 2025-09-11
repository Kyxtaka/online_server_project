import { TestBed } from '@angular/core/testing';

import { WolService } from './wol.service';

describe('WolService', () => {
  let service: WolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
