import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: number): string {
    const now = Date.now();
    const seconds = Math.floor((now - value) / 1000);

    if (seconds < 60) {
      return `${seconds} segundos atrás`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutos atrás`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} horas atrás`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days} días atrás`;
    }
    
    return new Date(value).toLocaleDateString();
  }

}