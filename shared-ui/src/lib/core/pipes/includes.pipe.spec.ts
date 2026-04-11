import { IncludesPipe } from './includes.pipe';

describe('IncludesPipe', () => {
  const pipe = new IncludesPipe();

  it('should return true if element is in array', () => {
    expect(pipe.transform([1, 2, 3], 2)).toBe(true);
  });

  it('should return false if element is not in array', () => {
    expect(pipe.transform([1, 2, 3], 4)).toBe(false);
  });

  it('should handle string arrays', () => {
    expect(pipe.transform(['a', 'b', 'c'], 'b')).toBe(true);
  });

  it('should return false for empty array', () => {
    expect(pipe.transform([], 1)).toBe(false);
  });
});
