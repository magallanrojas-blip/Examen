import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HabitacionService } from '../../services/habitacion.service';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';

declare var bootstrap: any; // 🔹 Declaración para usar Bootstrap Toasts

@Component({
    selector: 'app-habitacion',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './habitacion.component.html'
})
export class HabitacionComponent implements OnInit {

    habitaciones: any[] = [];
    tipos: any[] = [];

    mensajeExito: string = '';
    mensajeError: string = '';

    nueva: any = {
        numero: '',
        estado: 'Disponible',
        tipoHabitacion: null
    };

    seleccionada: any = {};

    constructor(
        private habitacionService: HabitacionService,
        private tipoService: TipoHabitacionService
    ) { }

    ngOnInit(): void {
        this.cargarHabitaciones();
        this.cargarTipos();
    }

    cargarHabitaciones(): void {
        this.habitacionService.listar().subscribe((data) => this.habitaciones = data);
    }

    cargarTipos(): void {
        this.tipoService.listar().subscribe((data) => this.tipos = data);
    }

    private existeNumero(numero: string, id?: number): boolean {
        const n = (numero || '').trim();
        if (!n) return false;
        return this.habitaciones.some(h => (h.numero || '').trim() === n && h.idHabitacion !== id);
    }

    guardar(): void {
        if (!this.nueva.numero || !this.nueva.tipoHabitacion) {
            this.error('Complete número y tipo');
            return;
        }

        if (this.existeNumero(this.nueva.numero)) {
            this.error('Número de habitación ya registrado');
            return;
        }

        this.habitacionService.guardar(this.nueva).subscribe((data) => {
            this.cargarHabitaciones();
            this.exito(`✅ Habitación registrada: N° ${data.numero} | Tipo: ${data.tipoHabitacion?.nombre} | Estado: ${data.estado}`);
            this.nueva = { numero: '', estado: 'Disponible', tipoHabitacion: null };
        }, (err) => {
            this.error(err?.error?.message || 'Error al registrar habitación');
        });
    }

    seleccionar(h: any): void {
        this.seleccionada = { ...h };
    }

    actualizar(): void {
        if (!this.seleccionada.numero || !this.seleccionada.tipoHabitacion) {
            this.error('Complete número y tipo');
            return;
        }

        if (this.existeNumero(this.seleccionada.numero, this.seleccionada.idHabitacion)) {
            this.error('Número de habitación ya registrado');
            return;
        }

        this.habitacionService.actualizar(this.seleccionada.idHabitacion, this.seleccionada)
            .subscribe((data) => {
                this.cargarHabitaciones();
                this.exito(`✏️ Habitación actualizada: N° ${data.numero} | Tipo: ${data.tipoHabitacion?.nombre} | Estado: ${data.estado}`);
            }, (err) => this.error(err?.error?.message || 'Error al actualizar habitación'));
    }

    eliminar(h: any): void {
        if (!confirm('¿Eliminar habitación?')) return;

        this.habitacionService.eliminar(h.idHabitacion).subscribe({
            next: () => {
                this.cargarHabitaciones();
                this.exito(`🗑️ Habitación eliminada: N° ${h.numero} | Tipo: ${h.tipoHabitacion?.nombre}`);
            },
            error: (err) => this.error(err?.error?.message || 'Error al eliminar habitación')
        });
    }

    compararTipo(t1: any, t2: any): boolean {
        return t1 && t2 ? t1.idTipo === t2.idTipo : t1 === t2;
    }

    // 🔹 Métodos para Bootstrap Toasts
    private toast(id: string) {
        const el = document.getElementById(id);
        if (!el) return;
        const t = new bootstrap.Toast(el, { delay: 4000 });
        t.show();
    }

    private exito(msg: string) {
        this.mensajeExito = msg.replace(/\n/g, '<br>');
        this.toast('toastExito');
        this.mensajeError = '';
    }

    private error(msg: string) {
        this.mensajeError = msg.replace(/\n/g, '<br>');
        this.toast('toastError');
        this.mensajeExito = '';
    }

}
