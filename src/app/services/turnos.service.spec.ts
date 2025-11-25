import { TestBed, inject } from '@angular/core/testing';
import { TurnosService } from '../services/turnos.service';

describe('Service: Turnos.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnosService]
    });
  });

  it('should ...', inject([TurnosService], (service: TurnosService) => {
    expect(service).toBeTruthy();
  }));
});
