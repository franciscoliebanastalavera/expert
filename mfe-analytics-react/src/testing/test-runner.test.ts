describe('mfe-analytics-react testing environment', () => {
  it('runs in jsdom with document available', () => {
    expect(typeof document).toBe('object');
    expect(document.createElement('div')).toBeTruthy();
  });

  it('has @testing-library/jest-dom matchers extended', () => {
    const node = document.createElement('span');
    node.textContent = 'ready';
    document.body.appendChild(node);
    expect(node).toBeInTheDocument();
    expect(node).toHaveTextContent('ready');
    document.body.removeChild(node);
  });
});
