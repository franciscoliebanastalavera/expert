import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeHtmlPipe],
    });
    pipe = TestBed.inject(SafeHtmlPipe);
  });

  it('should sanitize script tags', () => {
    const result = pipe.transform('<script>alert("xss")</script><p>safe</p>');
    expect(result.toString()).not.toContain('<script>');
  });

  it('should allow safe HTML', () => {
    const result = pipe.transform('<p>Hello <strong>World</strong></p>');
    const str = result.toString();
    expect(str).toContain('Hello');
  });
});
