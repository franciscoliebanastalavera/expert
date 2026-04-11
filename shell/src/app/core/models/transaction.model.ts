export enum TransactionStatus {
  Completed = 'Completada',
  Processing = 'Procesando',
  Pending = 'Pendiente',
  Rejected = 'Rechazada',
}

export enum TransactionType {
  SepaTranfer = 'Transferencia SEPA',
  Payroll = 'Pago Nómina',
  InvoiceCollection = 'Cobro Factura',
  DirectDebit = 'Domiciliación',
  InternationalTransfer = 'Transferencia Internacional',
  SupplierPayment = 'Pago Proveedor',
  ClientIncome = 'Ingreso Cliente',
}

export enum TransactionCategory {
  Treasury = 'Tesorería',
  Payroll = 'Nóminas',
  Suppliers = 'Proveedores',
  Clients = 'Clientes',
  Taxes = 'Impuestos',
  Insurance = 'Seguros',
  Services = 'Servicios',
}

export interface Transaction {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  iban: string;
  importe: number;
  divisa: string;
  estado: string;
  categoria: string;
}
