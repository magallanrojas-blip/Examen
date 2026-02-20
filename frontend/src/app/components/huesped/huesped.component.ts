import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HuespedService } from '../../services/huesped.service';
import { Huesped } from '../../models/huesped';

declare var bootstrap: any; // 🔹 Declaración para usar Bootstrap Toasts

@Component({
    selector: 'app-huesped',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './huesped.component.html'
})
export class HuespedComponent implements OnInit {

    huespedes: Huesped[] = [];
    mensajeExito: string = '';
    mensajeError: string = '';

    nuevo: Huesped = { nombre: '', dni: '', telefono: '', email: '' } as any;
    seleccionado: Huesped | any = {};

    constructor(private service: HuespedService) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar(): void {
        this.service.listar().subscribe((data) => this.huespedes = data);
    }

    // ✅ Validación frontend (DNI y teléfono duplicados)
    private existeDni(dni: string, id?: number): boolean {
        return this.huespedes.some(h => h.dni === dni && h.idHuesped !== id);
    }

    private existeTelefono(tel: string, id?: number): boolean {
        return this.huespedes.some(h => h.telefono === tel && h.idHuesped !== id);
    }

    guardar(): void {
        if (!this.nuevo.nombre || !this.nuevo.dni || !this.nuevo.telefono) {
            this.error('Complete los campos obligatorios');
            return;
        }
        if (this.existeDni(this.nuevo.dni)) { this.error('DNI ya registrado'); return; }
        if (this.existeTelefono(this.nuevo.telefono)) { this.error('Teléfono ya registrado'); return; }

        this.service.guardar(this.nuevo).subscribe((data) => {
            this.cargar();
            this.exito(`✅ Huésped registrado: ${data.nombre} | DNI: ${data.dni} | Tel: ${data.telefono}`);
            this.nuevo = { nombre: '', dni: '', telefono: '', email: '' } as any;
        }, (err) => this.error(err?.error?.message || 'Error al registrar huésped'));
    }

    seleccionar(h: Huesped): void {
        this.seleccionado = { ...h };
    }

    actualizar(): void {
        if (this.existeDni(this.seleccionado.dni, this.seleccionado.idHuesped)) { this.error('DNI ya registrado'); return; }
        if (this.existeTelefono(this.seleccionado.telefono, this.seleccionado.idHuesped)) { this.error('Teléfono ya registrado'); return; }

        this.service.actualizar(this.seleccionado.idHuesped, this.seleccionado).subscribe((data) => {
            this.cargar();
            this.exito(`✏️ Huésped actualizado: ${data.nombre} | DNI: ${data.dni} | Tel: ${data.telefono}`);
        }, (err) => this.error(err?.error?.message || 'Error al actualizar huésped'));
    }

    eliminar(h: any): void {
        if (!confirm('¿Eliminar huésped?')) return;

        this.service.eliminar(h.idHuesped).subscribe({
            next: () => {
                this.cargar();
                this.exito(`🗑️ Huésped eliminado: ${h.nombre} | DNI: ${h.dni} | Tel: ${h.telefono}`);
            },
            error: (err) => this.error(err?.error?.message || 'Error al eliminar huésped')
        });
    }

    // 🔹 Bootstrap Toasts
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
