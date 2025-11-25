import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { TurnoEstado } from '../modelos/turno.interface';

@Directive({
  selector: '[appBorderStatus]',
  standalone: true
})
export class BorderStatusDirective implements OnChanges {
  @Input('appBorderStatus') status!: TurnoEstado;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(): void {
    let borderColor = '#000';
    let borderWidth = '2px';
    
    if (this.status) {
        switch (this.status.toLowerCase()) {
          case 'aceptado':
            borderColor = '#28a745'; 
            break;
          case 'pendiente':
            borderColor = '#ffc107';
            break;
          case 'realizado':
            borderColor = '#007bff';
            break;
          case 'cancelado':
          case 'rechazado':
            borderColor = '#dc3545'; 
            break;
        }
    }

    this.renderer.setStyle(this.el.nativeElement, 'border-left', `${borderWidth} solid ${borderColor}`);
    this.renderer.setStyle(this.el.nativeElement, 'padding-left', `5px`);
  }
}