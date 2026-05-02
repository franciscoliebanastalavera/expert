import { getTestBed } from '@angular/core/testing';

describe('mfe-payments testing environment', () => {
  it('initializes the Angular TestBed platform', () => {
    expect(getTestBed().platform).toBeDefined();
  });

  it('initializes the Angular TestBed ngModule', () => {
    expect(getTestBed().ngModule).toBeDefined();
  });
});
