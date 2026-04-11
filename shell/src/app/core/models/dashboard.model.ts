// Modelos del dashboard — tipado estricto sin any

export interface DashboardMetric {
  titulo: string;
  valor: string;
  variacion: string;
  icono: string;
  positivo: boolean;
  descripcion: string;
  ruta: string;
}

export interface DashboardTab {
  id: string;
  label: string;
}

export interface DashboardOperation {
  tipo: string;
  importe: string;
  fecha: string;
  estado: string;
  iban: string;
}
