import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TipoHabitacionService } from '../../services/tipo-habitacion.service';

declare var bootstrap: any; // 🔹 Declaración para usar Bootstrap Toasts

@Component({
    selector: 'app-tipo-habitacion',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tipo-habitacion.component.html'
})
export class TipoHabitacionComponent implements OnInit {

    tipos: any[] = [];
    mensajeExito: string = '';
    mensajeError: string = '';

    nuevo: any = {
        nombre: '',
        descripcion: '',
        precioNoche: 0
    };

    seleccionado: any = {};

    constructor(private service: TipoHabitacionService) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar(): void {
        this.service.listar().subscribe((data) => {
            this.tipos = data;
        });
    }

    private existeNombre(nombre: string, id?: number): boolean {
        const n = (nombre || '').trim().toLowerCase();
        if (!n) return false;
        return this.tipos.some(t => (t.nombre || '').trim().toLowerCase() === n && t.idTipo !== id);
    }

    guardar(): void {
        if (!this.nuevo.nombre || this.nuevo.precioNoche <= 0) {
            this.error('Complete nombre y precio');
            return;
        }

        if (this.existeNombre(this.nuevo.nombre)) {
            this.error('Ya existe un tipo con ese nombre');
            return;
        }

        this.service.guardar(this.nuevo).subscribe((data) => {
            this.cargar();
            this.exito(`✅ Tipo registrado: ${data.nombre} | Precio: S/. ${data.precioNoche} | ${data.descripcion}`);
            this.nuevo = { nombre: '', descripcion: '', precioNoche: 0 };
        }, (err) => {
            this.error(err?.error?.message || 'Error al registrar tipo');
        });
    }

    seleccionar(t: any): void {
        this.seleccionado = { ...t };
    }

    actualizar(): void {
        if (!this.seleccionado.nombre || this.seleccionado.precioNoche <= 0) {
            this.error('Complete nombre y precio');
            return;
        }

        if (this.existeNombre(this.seleccionado.nombre, this.seleccionado.idTipo)) {
            this.error('Ya existe un tipo con ese nombre');
            return;
        }

        this.service.actualizar(this.seleccionado.idTipo, this.seleccionado).subscribe((data) => {
            this.cargar();
            this.exito(`✏️ Tipo actualizado: ${data.nombre} | Precio: S/. ${data.precioNoche} | ${data.descripcion}`);
        }, (err) => {
            this.error(err?.error?.message || 'Error al actualizar tipo');
        });
    }

    eliminar(t: any): void {
        if (!confirm('¿Eliminar tipo?')) return;

        this.service.eliminar(t.idTipo).subscribe({
            next: () => {
                this.cargar();
                this.exito(`🗑️ Tipo eliminado: ${t.nombre} | Precio: S/. ${t.precioNoche}`);
            },
            error: (err) => this.error(err?.error?.message || 'Error al eliminar tipo')
        });
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
