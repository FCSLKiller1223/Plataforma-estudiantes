import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPrestamo',
  standalone: true
})
export class EstadoPrestamoPipe implements PipeTransform {

  transform(estado: string) {
    const e: Record<string, string> = {
      pendiente: 'Pendiente',
      aprobado: 'Aprobado',
      rechazado: 'Rechazado',
      devuelto: 'Devuelto'
    };

    return e[estado] ?? estado;
  }
}