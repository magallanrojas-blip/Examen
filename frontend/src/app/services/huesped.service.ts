import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Huesped } from '../models/huesped';

@Injectable({ providedIn: 'root' })
export class HuespedService {
  private url = 'http://localhost:8080/api/huespedes';
  constructor(private http: HttpClient) {}

  listar(): Observable<Huesped[]> {
    return this.http.get<Huesped[]>(this.url);
  }

  guardar(h: Huesped): Observable<Huesped> {
    return this.http.post<Huesped>(this.url, h);
  }

  actualizar(id: number, h: Huesped): Observable<Huesped> {
    return this.http.put<Huesped>(`${this.url}/${id}`, h);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
