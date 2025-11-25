import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, OnInit, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appCaptcha]',
  standalone: true
})
export class CaptchaDirective implements OnInit, OnChanges {
  @Input() captchaDisabled: boolean = false;
  @Output() captchaSolved = new EventEmitter<boolean>();
  
  private expectedAnswer!: number;
  private captchaElement: HTMLInputElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setupCaptcha();
  }
  
  ngOnChanges(): void {
      if (this.captchaDisabled) {
          this.captchaSolved.emit(true);
      } else {
          this.setupCaptcha();
      }
  }
  
  setupCaptcha(): void {
      if (this.captchaDisabled) return;

      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      this.expectedAnswer = num1 + num2;
      this.captchaSolved.emit(false);

      const container = this.el.nativeElement.querySelector('.captcha-placeholder');
      if (container) {
          // Limpiar contenido previo
          this.renderer.setProperty(container, 'innerHTML', ''); 

          const textNode = this.renderer.createText(`**[CAPCHA PROPIO]** ¿Cuánto es ${num1} + ${num2}? `);
          this.renderer.appendChild(container, textNode);
          
          this.captchaElement = this.renderer.createElement('input');
          this.renderer.setAttribute(this.captchaElement, 'type', 'number');
          this.renderer.setAttribute(this.captchaElement, 'placeholder', 'Respuesta');
          this.renderer.setAttribute(this.captchaElement, 'style', 'margin-top: 5px; padding: 5px;');
          this.renderer.appendChild(container, this.captchaElement);
          
          this.renderer.listen(this.captchaElement, 'input', (event) => this.checkAnswer(event.target.value));
      }
  }

  checkAnswer(answer: string): void {
    const isCorrect = parseInt(answer) === this.expectedAnswer;
    this.captchaSolved.emit(isCorrect);
  }
}