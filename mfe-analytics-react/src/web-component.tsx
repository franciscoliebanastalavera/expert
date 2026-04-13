// Web Component wrapper for the Analytics micro-frontend.
// Registers the `mfe-analytics` custom element that encapsulates the React app
// with Shadow DOM for style isolation.

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';

class MfeAnalyticsElement extends HTMLElement {
  private raizReact: Root | null = null;

  connectedCallback(): void {
    const sombra = this.attachShadow({ mode: 'open' });

    const contenedor = document.createElement('div');
    contenedor.id = 'mfe-analytics-root';
    contenedor.style.width = '100%';
    contenedor.style.height = '100%';
    sombra.appendChild(contenedor);

    this.raizReact = createRoot(contenedor);
    this.raizReact.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }

  disconnectedCallback(): void {
    // Unmount the React tree so any effects clean up and we avoid memory leaks.
    if (this.raizReact) {
      this.raizReact.unmount();
      this.raizReact = null;
    }
  }
}

// Guard against re-registration during dev hot-reload.
if (!customElements.get('mfe-analytics')) {
  customElements.define('mfe-analytics', MfeAnalyticsElement);
}

export default MfeAnalyticsElement;
