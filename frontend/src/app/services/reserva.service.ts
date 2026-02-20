import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reserva } from '../models/reserva';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReservaService {

    private url = 'http://localhost:8080/api/reservas';

    constructor(private http: HttpClient) { }

    // LISTAR
    listar(): Observable<Reserva[]> {
        return this.http.get<Reserva[]>(this.url);
    }

    // GUARDAR
    guardar(reserva: Reserva): Observable<Reserva> {
        return this.http.post<Reserva>(this.url, reserva);
    }

    // ACTUALIZAR
    actualizar(id: number, reserva: Reserva): Observable<Reserva> {
        return this.http.put<Reserva>(`${this.url}/${id}`, reserva);
    }

    // ELIMINAR
    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    pdf(id: number) {
        return this.http.get(`${this.url}/${id}/pdf`, { responseType: 'blob' });
    }

}
