import { TipoHabitacion } from './tipo-habitacion';

export interface Habitacion {
  idHabitacion?: number;
  numero: string;
  estado: string;
  tipoHabitacion: TipoHabitacion;
}
