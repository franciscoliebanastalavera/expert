// Async bootstrap for Module Federation: this pattern lets the shared
// dependencies resolve before the app mounts in the DOM.

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const contenedor = document.getElementById('root');

if (contenedor) {
  const raiz = createRoot(contenedor);
  raiz.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No se encontro el elemento #root en el DOM');
}
