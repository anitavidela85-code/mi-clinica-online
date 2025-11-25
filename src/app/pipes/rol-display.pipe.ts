import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolDisplay',
  standalone: true
})
export class RolDisplayPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    const roleMap: { [key: string]: string } = {
      'administrador': 'Administrador 👑',
      'especialista': 'Especialista 👨‍⚕️',
      'paciente': 'Paciente 🧑',
    };
    return roleMap[value.toLowerCase()] || value;
  }
}