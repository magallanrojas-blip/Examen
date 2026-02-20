import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoHabitacion } from '../models/tipo-habitacion';

@Injectable({ providedIn: 'root' })
export class TipoHabitacionService {
  private url = 'http://localhost:8080/api/tipos';
  constructor(private http: HttpClient) {}

  listar(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.url);
  }

  guardar(t: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.url, t);
  }

  actualizar(id: number, t: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(`${this.url}/${id}`, t);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
