import { act } from '@testing-library/react';
import './web-component';

const TAG = 'mfe-analytics';

async function mount(): Promise<HTMLElement> {
  const element = document.createElement(TAG);
  await act(async () => {
    document.body.appendChild(element);
  });
  return element;
}

async function unmount(element: HTMLElement): Promise<void> {
  if (element.parentNode) {
    await act(async () => {
      element.parentNode!.removeChild(element);
    });
  }
}

describe('mfe-analytics web component', () => {
  it('registers the custom element on import', () => {
    const ctor = customElements.get(TAG);
    expect(ctor).toBeDefined();
    expect(typeof ctor).toBe('function');
  });

  it('is idempotent: re-importing does not throw on re-define (the guard skips it)', () => {
    expect(() => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./web-component');
      });
    }).not.toThrow();
    expect(customElements.get(TAG)).toBeDefined();
  });

  it('attaches an OPEN shadow root with a #mfe-analytics-root container on connection', async () => {
    const element = await mount();

    expect(element.shadowRoot).not.toBeNull();
    expect(element.shadowRoot!.mode).toBe('open');

    const rootDiv = element.shadowRoot!.querySelector<HTMLDivElement>('#mfe-analytics-root');
    expect(rootDiv).not.toBeNull();
    expect(rootDiv!.style.width).toBe('100%');
    expect(rootDiv!.style.height).toBe('100%');

    await unmount(element);
  });

  it('renders the App component inside the shadow root', async () => {
    const element = await mount();

    const text = element.shadowRoot!.textContent ?? '';
    expect(text).toContain('Dashboard de Analytics');
    expect(text).toContain('Transacciones Recientes');
    expect(text).toContain('TXN-001');

    await unmount(element);
  });

  it('isolates two instances in separate shadow roots', async () => {
    const a = await mount();
    const b = await mount();

    expect(a.shadowRoot).not.toBe(b.shadowRoot);
    expect(a.shadowRoot!.querySelector('#mfe-analytics-root')).not.toBe(
      b.shadowRoot!.querySelector('#mfe-analytics-root'),
    );

    await unmount(a);
    await unmount(b);
  });

  it('unmounts the React tree when the element is disconnected from the DOM', async () => {
    const element = await mount();
    const shadow = element.shadowRoot!;
    expect(shadow.textContent).toContain('Dashboard de Analytics');

    await unmount(element);

    expect(shadow.textContent).not.toContain('Dashboard de Analytics');
  });
});
