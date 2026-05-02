import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    document.documentElement.lang = '';
  });

  afterEach(() => {
    cleanup();
    document.documentElement.lang = '';
  });

  describe('Spanish (default when <html lang> is empty)', () => {
    beforeEach(() => {
      render(<App />);
    });

    it('renders the dashboard title and subtitle in Spanish', () => {
      expect(screen.getByText('Dashboard de Analytics')).toBeInTheDocument();
      expect(
        screen.getByText('CapitalFlow - Resumen financiero en tiempo real'),
      ).toBeInTheDocument();
    });

    it('renders the four KPI cards with Spanish labels and exact mock values', () => {
      expect(screen.getByText('INGRESOS TOTALES')).toBeInTheDocument();
      expect(screen.getByText('GASTOS OPERATIVOS')).toBeInTheDocument();
      expect(screen.getByText('BENEFICIO NETO')).toBeInTheDocument();
      expect(screen.getByText('CLIENTES ACTIVOS')).toBeInTheDocument();
      expect(screen.getByText('1.245.320 €')).toBeInTheDocument();
      expect(screen.getByText('387.210 €')).toBeInTheDocument();
      expect(screen.getByText('858.110 €')).toBeInTheDocument();
      expect(screen.getByText('2.847')).toBeInTheDocument();
    });

    it('uses ▲ for positive variation cards and ▼ for the negative one', () => {
      const text = document.body.textContent ?? '';
      expect(text).toContain('▲ +12.5% vs. mes anterior');
      expect(text).toContain('▼ +3.2% vs. mes anterior');
      expect(text).toContain('▲ +18.7% vs. mes anterior');
      expect(text).toContain('▲ +5.1% vs. mes anterior');
    });

    it('renders the recent transactions section title in Spanish', () => {
      expect(screen.getByText('Transacciones Recientes')).toBeInTheDocument();
    });

    it('renders the table column headers in Spanish', () => {
      ['ID', 'Fecha', 'Concepto', 'Importe', 'Estado'].forEach((header) => {
        expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
      });
    });

    it('renders one tbody row per mock transaction (5 rows + 1 header row)', () => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(6);
    });

    it('renders each transaction id and amount as cells', () => {
      ['TXN-001', 'TXN-002', 'TXN-003', 'TXN-004', 'TXN-005'].forEach((id) => {
        expect(screen.getByText(id)).toBeInTheDocument();
      });
      ['15.200 €', '42.800 €', '8.350 €', '120 €', '50.000 €'].forEach((amount) => {
        expect(screen.getByText(amount)).toBeInTheDocument();
      });
    });

    it('renders the translated transaction concepts in Spanish', () => {
      expect(screen.getByText('Transferencia SEPA')).toBeInTheDocument();
      expect(screen.getByText('Pago nóminas')).toBeInTheDocument();
      expect(screen.getByText('Cobro factura #892')).toBeInTheDocument();
      expect(screen.getByText('Comisión bancaria')).toBeInTheDocument();
      expect(screen.getByText('Inversión fondo A')).toBeInTheDocument();
    });

    it('renders the translated status labels for each transaction', () => {
      expect(screen.getAllByText('Completada')).toHaveLength(3);
      expect(screen.getAllByText('Pendiente')).toHaveLength(1);
      expect(screen.getAllByText('En proceso')).toHaveLength(1);
    });
  });

  describe('English (when <html lang="en"> at mount)', () => {
    beforeEach(() => {
      document.documentElement.lang = 'en';
      render(<App />);
    });

    it('renders the dashboard title and subtitle in English', () => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(
        screen.getByText('CapitalFlow - Real-time financial overview'),
      ).toBeInTheDocument();
    });

    it('renders the four KPI cards with English labels', () => {
      expect(screen.getByText('TOTAL INCOME')).toBeInTheDocument();
      expect(screen.getByText('OPERATING EXPENSES')).toBeInTheDocument();
      expect(screen.getByText('NET PROFIT')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE CLIENTS')).toBeInTheDocument();
    });

    it('renders the section title and column headers in English', () => {
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      ['ID', 'Date', 'Concept', 'Amount', 'Status'].forEach((header) => {
        expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
      });
    });

    it('renders the translated status labels in English', () => {
      expect(screen.getAllByText('Completed')).toHaveLength(3);
      expect(screen.getAllByText('Pending')).toHaveLength(1);
      expect(screen.getAllByText('In progress')).toHaveLength(1);
    });

    it('uses the English vsLastMonth caption on the variation lines', () => {
      const text = document.body.textContent ?? '';
      expect(text).toContain('▲ +12.5% vs. last month');
      expect(text).toContain('▼ +3.2% vs. last month');
    });

    it('case-insensitively detects the language (lang="EN" still resolves to English)', () => {
      cleanup();
      document.documentElement.lang = 'EN';
      render(<App />);
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });
  });

  describe('reactive language switch via MutationObserver on <html lang>', () => {
    it('switches from Spanish to English when document.documentElement.lang changes at runtime', async () => {
      render(<App />);
      expect(screen.getByText('Dashboard de Analytics')).toBeInTheDocument();

      await act(async () => {
        document.documentElement.lang = 'en';
      });

      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard de Analytics')).not.toBeInTheDocument();
    });

    it('falls back to Spanish when lang is cleared at runtime', async () => {
      document.documentElement.lang = 'en';
      render(<App />);
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();

      await act(async () => {
        document.documentElement.lang = '';
      });

      expect(screen.getByText('Dashboard de Analytics')).toBeInTheDocument();
    });

    it('disconnects the MutationObserver on unmount so further lang changes do not leak updates', () => {
      const disconnectSpy = jest.spyOn(MutationObserver.prototype, 'disconnect');
      const { unmount } = render(<App />);
      const callsBeforeUnmount = disconnectSpy.mock.calls.length;
      unmount();
      expect(disconnectSpy.mock.calls.length).toBeGreaterThan(callsBeforeUnmount);
      disconnectSpy.mockRestore();
    });
  });
});
