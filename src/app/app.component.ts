import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { UsuariosService } from './services/usuarios.service'; 
import { I18nService } from './services/i18n.service';
import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations'; // Imports de Animación (Sprint 3)


const slideInAnimation = 
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [style({ left: '100%', opacity: 0 })], { optional: true }),
      group([
        query(':leave', [animate('300ms ease-out', style({ left: '-100%', opacity: 0 }))], { optional: true }),
        query(':enter', [animate('300ms ease-out', style({ left: '0%', opacity: 1 }))], { optional: true }),
      ]),
      query(':enter', animateChild(), { optional: true }),
    ])
  ]);


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [slideInAnimation] 
})
export class AppComponent implements OnInit {
  
  constructor(private usuariosService: UsuariosService, public i18nService: I18nService, private router: Router) {}

  ngOnInit(): void {
    
    if (!this.usuariosService.getCurrentUser()) {
        this.router.navigate(['/bienvenida']);
    }
  }
  
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  
  setLang(lang: 'es' | 'en' | 'pt'): void {
      this.i18nService.setLanguage(lang);
  }
}