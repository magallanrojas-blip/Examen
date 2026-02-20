import { Routes } from '@angular/router';

import { ReservaComponent } from './components/reserva/reserva.component';
import { HuespedComponent } from './components/huesped/huesped.component';
import { HabitacionComponent } from './components/habitacion/habitacion.component';
import { TipoHabitacionComponent } from './components/tipo-habitacion/tipo-habitacion.component';

export const routes: Routes = [
  { path: '', component: ReservaComponent },
  { path: 'huesped', component: HuespedComponent },
  { path: 'habitacion', component: HabitacionComponent },
  { path: 'tipo', component: TipoHabitacionComponent }
];
