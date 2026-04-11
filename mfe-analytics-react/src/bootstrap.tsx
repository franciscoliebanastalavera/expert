// Bootstrap asincrono para Module Federation
// Este patron permite que las dependencias compartidas se resuelvan correctamente
// antes de que la aplicacion se monte en el DOM

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Obtener el contenedor raiz del DOM
const contenedor = document.getElementById('root');

if (contenedor) {
  // Crear la raiz de React 18 y renderizar la aplicacion
  const raiz = createRoot(contenedor);
  raiz.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No se encontro el elemento #root en el DOM');
}
