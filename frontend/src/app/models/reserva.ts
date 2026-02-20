import { Huesped } from './huesped';
import { Habitacion } from './habitacion';

export interface Reserva {
  idReserva?: number;
  fechaInicio: string;
  fechaFin: string;
  noches?: number;
  precioNoche?: number;
  total?: number;
  huesped: Huesped;
  habitacion: Habitacion;
}
