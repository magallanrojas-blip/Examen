import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion';

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  private url = 'http://localhost:8080/api/habitaciones';
  constructor(private http: HttpClient) {}

  listar(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.url);
  }

  guardar(h: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.url, h);
  }

  actualizar(id: number, h: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.url}/${id}`, h);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
