import { Component } from '@angular/core';

// Componente principal del dashboard - página de inicio del Shell
@Component({
  selector: 'app-home',
  template: `
    <section class="home-container">
      <h1>CapitalFlow Dashboard</h1>
      <p>Plataforma de gestión financiera con arquitectura de micro-frontends.</p>

      <div class="cards">
        <div class="card" routerLink="/analytics">
          <h3>Analytics</h3>
          <p>Visualización de métricas y KPIs financieros en tiempo real.</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .home-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      h1 {
        color: #1a237e;
        margin-bottom: 0.5rem;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .card {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        cursor: pointer;
        transition: box-shadow 0.2s;
      }
      .card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .card h3 {
        color: #1565c0;
        margin: 0 0 0.5rem;
      }
    `,
  ],
})
export class HomeComponent {}
