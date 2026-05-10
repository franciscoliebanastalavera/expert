import { TestBed } from '@angular/core/testing';
import { DynamicCssService } from './dynamic-css.service';

describe('DynamicCssService', () => {
  let service: DynamicCssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicCssService);
  });

  afterEach(() => {
    service.clearAllDynamicStyles();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should insert a style element with the css rule when creating a class', () => {
    const className = service.createDynamicClass('test-class', 'color: red;', 'cmp1');
    const inserted = document.head.querySelector('style:last-of-type') as HTMLStyleElement | null;

    expect(className).toBe('test-class-cmp1');
    expect(inserted).not.toBeNull();
    expect(inserted!.textContent).toContain('.test-class-cmp1');
    expect(inserted!.textContent).toContain('color: red');
  });

  it('should remove the style element when removing a class', () => {
    const className = service.createDynamicClass('removable', 'color: blue;', 'cmp2');
    const insertedBefore = document.head.querySelector('style:last-of-type') as HTMLStyleElement | null;
    expect(insertedBefore!.textContent).toContain(className);

    service.removeDynamicClass(className);

    const stillThere = Array.from(document.head.querySelectorAll('style')).some((el) =>
      (el.textContent ?? '').includes(className),
    );
    expect(stillThere).toBeFalse();
  });

  it('should not interpret HTML embedded in css content (no script element appended)', () => {
    const malicious = 'color: red; } </style><script>window.__pwn=1;</script><style>.x{';
    const className = service.createDynamicClass('hostile', malicious, 'cmp3');
    const inserted = Array.from(document.head.querySelectorAll('style')).find((el) =>
      (el.textContent ?? '').includes(className),
    ) as HTMLStyleElement | undefined;

    expect(inserted).toBeDefined();
    expect(inserted!.children.length).toBe(0);
    expect(inserted!.querySelector('script')).toBeNull();
    expect(document.head.querySelector('script[data-pwn]')).toBeNull();
    expect((window as unknown as { __pwn?: number }).__pwn).toBeUndefined();
  });

  it('should replace contents on update without accumulating text nodes', () => {
    const className = service.createDynamicClass('updatable', 'color: red;', 'cmp4');
    service.updateDynamicClass(className, 'color: green;');

    const inserted = Array.from(document.head.querySelectorAll('style')).find((el) =>
      (el.textContent ?? '').includes(className),
    ) as HTMLStyleElement | undefined;

    expect(inserted).toBeDefined();
    expect(inserted!.childNodes.length).toBe(1);
    expect(inserted!.textContent).toContain('color: green');
    expect(inserted!.textContent).not.toContain('color: red');
  });

  it('should clear all dynamic styles', () => {
    const a = service.createDynamicClass('a', 'color: red;', 'cmpA');
    const b = service.createDynamicClass('b', 'color: blue;', 'cmpB');

    service.clearAllDynamicStyles();

    const remaining = Array.from(document.head.querySelectorAll('style')).filter((el) => {
      const text = el.textContent ?? '';
      return text.includes(a) || text.includes(b);
    });
    expect(remaining.length).toBe(0);
  });

  it('should remove all classes for a given component id', () => {
    service.createDynamicClass('alpha', 'color: red;', 'shared');
    service.createDynamicClass('beta', 'color: blue;', 'shared');
    service.createDynamicClass('gamma', 'color: green;', 'other');

    service.removeComponentClasses('shared');

    const styles = Array.from(document.head.querySelectorAll('style'));
    const sharedRemain = styles.some((el) => /alpha-shared|beta-shared/.test(el.textContent ?? ''));
    const otherRemain = styles.some((el) => /gamma-other/.test(el.textContent ?? ''));
    expect(sharedRemain).toBeFalse();
    expect(otherRemain).toBeTrue();
  });

  it('should generate component ids that look like alphanumeric tokens', () => {
    const id = service.generateComponentId();
    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(id.length).toBeGreaterThan(0);
  });
});
