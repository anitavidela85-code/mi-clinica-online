import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { UsuariosService } from './services/usuarios.service'; 
import { I18nService } from './services/i18n.service';
import { slideInAnimation } from './animaciones/animaciones';


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
