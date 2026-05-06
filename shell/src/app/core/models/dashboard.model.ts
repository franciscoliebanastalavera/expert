import { IconName } from '../../shared/icon/icon.constants';
import { TransactionStatus } from './transaction.model';

export interface DashboardMetric {
  titulo: string;
  valor: string;
  variacion: string;
  icono: IconName;
  positivo: boolean;
  descripcion: string;
  ruta: string;
}

export interface DashboardOperation {
  tipo: string;
  importe: string;
  fecha: string;
  estado: TransactionStatus;
  iban: string;
}
