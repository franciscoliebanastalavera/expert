// Envoltorio Web Component para el micro-frontend de Analytics
// Registra el custom element 'mfe-analytics' que encapsula la app React
// usando Shadow DOM para aislamiento de estilos

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';

// Clase del Web Component que encapsula la aplicacion React
class MfeAnalyticsElement extends HTMLElement {
  // Referencia a la raiz de React para poder desmontarla al desconectar
  private raizReact: Root | null = null;

  // Callback del ciclo de vida: se ejecuta al insertar el elemento en el DOM
  connectedCallback(): void {
    // Crear Shadow DOM para aislar los estilos del micro-frontend
    const sombra = this.attachShadow({ mode: 'open' });

    // Crear un contenedor dentro del Shadow DOM para montar React
    const contenedor = document.createElement('div');
    contenedor.id = 'mfe-analytics-root';
    // Asegurar que el contenedor ocupe todo el espacio disponible
    contenedor.style.width = '100%';
    contenedor.style.height = '100%';
    sombra.appendChild(contenedor);

    // Crear la raiz de React 18 y renderizar la aplicacion dentro del Shadow DOM
    this.raizReact = createRoot(contenedor);
    this.raizReact.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }

  // Callback del ciclo de vida: se ejecuta al eliminar el elemento del DOM
  disconnectedCallback(): void {
    // Desmontar la aplicacion React para liberar recursos y evitar fugas de memoria
    if (this.raizReact) {
      this.raizReact.unmount();
      this.raizReact = null;
    }
  }
}

// Registrar el custom element solo si no ha sido registrado previamente
// Esto evita errores al recargar en caliente durante el desarrollo
if (!customElements.get('mfe-analytics')) {
  customElements.define('mfe-analytics', MfeAnalyticsElement);
}

// Exportar la clase por si se necesita extender o referenciar desde fuera
export default MfeAnalyticsElement;
