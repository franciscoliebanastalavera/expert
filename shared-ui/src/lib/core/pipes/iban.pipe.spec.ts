import { IbanPipe } from './iban.pipe';
import { FormControl } from '@angular/forms';

describe('IbanPipe', () => {
  const pipe = new IbanPipe();

  it('should mask IBAN when hide is true', () => {
    const control = new FormControl('');
    const result = pipe.transform('ES9121000418450200051332', control, true);
    expect(result).toContain('ES91');
    expect(result).toContain('1332');
    expect(result).toContain('****');
  });

  it('should return original value when hide is false and no control value', () => {
    const control = new FormControl('');
    const result = pipe.transform('ES9121000418450200051332', control, false);
    expect(result).toBeTruthy();
  });

  it('should return string for null input', () => {
    const control = new FormControl('');
    const result = pipe.transform(null, control, false);
    expect(result).toBe('null');
  });
});
