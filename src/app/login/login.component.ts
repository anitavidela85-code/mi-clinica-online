import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../modelos/usuario.interface';
import { UsuariosService } from '../services/usuarios.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { I18nService } from '../services/i18n.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TitleCasePipe, TranslatePipe], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
 
})
export class LoginComponent implements OnInit {
 
  email: string = '';
  password: string = '';


  quickAccessUsers: Partial<Usuario>[] = [
    { email: 'admin@clinic.com', password: '123', role: 'administrador', perfilImageUrl: 'https://randomuser.me/api/portraits/thumb/men/10.jpg' },
    { email: 'esp1@clinic.com', password: '123', role: 'especialista', perfilImageUrl: 'https://randomuser.me/api/portraits/thumb/women/20.jpg' },
    { email: 'esp2@clinic.com', password: '123', role: 'especialista', perfilImageUrl: 'https://randomuser.me/api/portraits/thumb/men/30.jpg' },
    { email: 'pac1@clinic.com', password: '123', role: 'paciente', perfilImageUrl: 'https://randomuser.me/api/portraits/thumb/women/40.jpg' },
    { email: 'pac2@clinic.com', password: '123', role: 'paciente', perfilImageUrl: 'https://randomuser.me/api/portraits/thumb/men/50.jpg' },
    { email: 'pac3@clinic.com', password: '123', role: 'paciente', perfilImageUrl: 'https://randomuser.me/api/portraits/thumb/women/60.jpg' },
  ];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private i18nService: I18nService 
  ) { }

  ngOnInit(): void {}

    async quickLogin(user: Partial<Usuario>): Promise<void> {
        if (!user.email || !user.password) return; 

        try {
            
            const result = await this.usuariosService.login(user.email, user.password);
            
            if (result.success) {
                alert(`Login exitoso como ${result.user!.role}: ${result.user!.email}. Redirigiendo a /home...`);
                this.router.navigate(['/home']);
            } else {
                alert(result.message);
            }
        } catch (e: any) {
            alert(e.message || 'Error desconocido durante el login.');
        }
    }

    async manualLogin(): Promise<void> {
        if (this.email && this.password) {
            try {
                
                const result = await this.usuariosService.login(this.email, this.password);
                
                if (result.success) {
                    alert(`Login exitoso como ${result.user!.role}: ${result.user!.email}. Redirigiendo a /home...`);
                    this.router.navigate(['/home']);
                } else {
                    alert(result.message);
                }
            } catch (e: any) {
                alert(e.message || 'Error desconocido durante el login.');
            }
        } else {
            alert('Por favor, ingrese email y contraseña.');
        }
    }
}