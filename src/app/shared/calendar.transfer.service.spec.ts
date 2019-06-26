import { TestBed } from '@angular/core/testing';

import { Calendar.TransferService } from './calendar.transfer.service';

describe('Calendar.TransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Calendar.TransferService = TestBed.get(Calendar.TransferService);
    expect(service).toBeTruthy();
  });
});
