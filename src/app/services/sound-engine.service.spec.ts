import { TestBed, inject } from '@angular/core/testing';

import { SoundEngineService } from './sound-engine.service';

describe('SoundEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundEngineService]
    });
  });

  it('should be created', inject([SoundEngineService], (service: SoundEngineService) => {
    expect(service).toBeTruthy();
  }));
});
