import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservaService } from '../../services/reserva.service';
import { HuespedService } from '../../services/huesped.service';
import { HabitacionService } from '../../services/habitacion.service';
import { Reserva } from '../../models/reserva';

declare var bootstrap: any; // 🔹 Declaración para usar Bootstrap Toasts

@Component({
    selector: 'app-reserva',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reserva.component.html'
})
export class ReservaComponent implements OnInit {

    reservas: Reserva[] = [];
    huespedes: any[] = [];
    habitaciones: any[] = [];

    paginaActual: number = 1;
    itemsPorPagina: number = 10;

    mensajeExito: string = '';
    mensajeError: string = '';

    nuevaReserva: Reserva = {
        fechaInicio: '',
        fechaFin: '',
        huesped: null as any,
        habitacion: null as any
    };

    reservaSeleccionada: Reserva | any = {};

    constructor(
        private reservaService: ReservaService,
        private huespedService: HuespedService,
        private habitacionService: HabitacionService
    ) { }

    ngOnInit(): void {
        this.cargarReservas();
        this.cargarHuespedes();
        this.cargarHabitaciones();
    }

    cargarReservas(): void {
        this.reservaService.listar().subscribe((data: Reserva[]) => {
            this.reservas = data;
            this.paginaActual = 1;
        });
    }

    cargarHuespedes(): void {
        this.huespedService.listar().subscribe(data => this.huespedes = data);
    }

    cargarHabitaciones(): void {
        this.habitacionService.listar().subscribe(data => this.habitaciones = data);
    }

    guardar(): void {

        if (!this.nuevaReserva.fechaInicio ||
            !this.nuevaReserva.fechaFin ||
            !this.nuevaReserva.huesped ||
            !this.nuevaReserva.habitacion) {
            this.error("Complete todos los campos");
            return;
        }

        if (this.nuevaReserva.fechaInicio >= this.nuevaReserva.fechaFin) {
            this.error("La fecha fin debe ser mayor a la fecha inicio");
            return;
        }

        this.reservaService.guardar(this.nuevaReserva).subscribe({
            next: (data: Reserva) => {
                this.cargarReservas();
                this.exito(
                    `Reserva registrada: ${data.huesped.nombre} (DNI: ${data.huesped.dni}) | ` +
                    `Hab: ${data.habitacion.numero} - ${data.habitacion.tipoHabitacion.nombre}\n` +
                    `Ingreso: ${data.fechaInicio} | Salida: ${data.fechaFin} | Noches: ${data.noches} | Total: S/. ${data.total}`
                );

                this.nuevaReserva = {
                    fechaInicio: '',
                    fechaFin: '',
                    huesped: null as any,
                    habitacion: null as any
                };
            },
            error: (err) => this.error(err?.error?.message || "Error al registrar reserva")
        });
    }

    seleccionarReserva(reserva: Reserva): void {
        this.reservaSeleccionada = { ...reserva };
    }

    actualizar(): void {

        if (!this.reservaSeleccionada.fechaInicio ||
            !this.reservaSeleccionada.fechaFin ||
            !this.reservaSeleccionada.huesped ||
            !this.reservaSeleccionada.habitacion) {
            this.error("Complete todos los campos");
            return;
        }

        if (this.reservaSeleccionada.fechaInicio >= this.reservaSeleccionada.fechaFin) {
            this.error("La fecha fin debe ser mayor a la fecha inicio");
            return;
        }

        this.reservaService.actualizar(
            this.reservaSeleccionada.idReserva,
            this.reservaSeleccionada
        ).subscribe({
            next: (data: Reserva) => {
                this.cargarReservas();
                this.exito(
                    `Reserva actualizada: ${data.huesped.nombre} | Hab: ${data.habitacion.numero} (${data.habitacion.tipoHabitacion.nombre})\n` +
                    `Ingreso: ${data.fechaInicio} | Salida: ${data.fechaFin} | Noches: ${data.noches} | Total: S/. ${data.total}`
                );
            },
            error: (err) => this.error(err?.error?.message || "Error al actualizar reserva")
        });
    }

    eliminarReserva(r: any): void {
        if (!confirm("¿Desea eliminar esta reserva?")) return;

        this.reservaService.eliminar(r.idReserva).subscribe({
            next: () => {
                this.cargarReservas();
                this.exito(
                    `Reserva eliminada: ${r.huesped?.nombre} | Hab: ${r.habitacion?.numero} | ` +
                    `Ingreso: ${r.fechaInicio} - Salida: ${r.fechaFin}`
                );
            },
            error: (err) => this.error(err?.error?.message || 'Error al eliminar reserva')
        });
    }

    compararHuesped(h1: any, h2: any): boolean {
        return h1 && h2 ? h1.idHuesped === h2.idHuesped : h1 === h2;
    }

    compararHabitacion(h1: any, h2: any): boolean {
        return h1 && h2 ? h1.idHabitacion === h2.idHabitacion : h1 === h2;
    }

    get reservasPaginadas(): Reserva[] {
        const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
        const fin = inicio + this.itemsPorPagina;
        return this.reservas.slice(inicio, fin);
    }

    get totalPaginas(): number[] {
        const total = Math.ceil(this.reservas.length / this.itemsPorPagina);
        return Array(total).fill(0).map((_, i) => i + 1);
    }

    cambiarPagina(pagina: number): void {
        if (pagina < 1 || pagina > this.totalPaginas.length) return;
        this.paginaActual = pagina;
    }

    descargarPdf(id: number): void {
        this.reservaService.pdf(id).subscribe((blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        });
    }

    // 🔹 Toasts Bootstrap
    private toast(id: string) {
        const el = document.getElementById(id);
        if (!el) return;
        const t = new bootstrap.Toast(el, { delay: 4000 });
        t.show();
    }

    private exito(msg: string) {
        this.mensajeExito = msg.replace(/\n/g, '<br>');
        this.toast('toastExito');
    }

    private error(msg: string) {
        this.mensajeError = msg.replace(/\n/g, '<br>');
        this.toast('toastError');
    }

}
