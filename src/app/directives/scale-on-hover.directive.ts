import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScaleOnHover]',
  standalone: true
})
export class ScaleOnHoverDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('mouseenter') onMouseEnter() {
    
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.02)');
    
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 4px 8px rgba(0,0,0,0.2)');
  }

  
  @HostListener('mouseleave') onMouseLeave() {
    
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
  }
}
