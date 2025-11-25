import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { UserRole } from '../modelos/usuario.interface';

@Directive({
  selector: '[appHighlightRole]',
  standalone: true
})
export class HighlightRoleDirective implements OnChanges {
  @Input('appHighlightRole') role!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(): void {
    let color = '';
    switch (this.role.toLowerCase()) {
      case 'administrador':
        color = '#dc3545';
        break;
      case 'especialista':
        color = '#17a2b8';
        break;
      case 'paciente':
        color = '#28a745';
        break;
      default:
        color = '#6c757d';
    }
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
  }
}