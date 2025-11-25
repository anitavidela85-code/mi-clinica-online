/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DescargaService } from './descarga.service';

describe('Service: Descarga', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescargaService]
    });
  });

  it('should ...', inject([DescargaService], (service: DescargaService) => {
    expect(service).toBeTruthy();
  }));
});
