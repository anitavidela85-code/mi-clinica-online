import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioRapido } from '../modelos/usuario-rapido.interface';


class AuthService {
  login(email: string, role: string): void {
    console.log(`Simulando login para: ${email} como ${role}`);
    alert(`Login exitoso como ${role}: ${email}. Redirigiendo a /home...`);
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TitleCasePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css', 
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  
  email: string = '';
  password: string = '';

  quickAccessUsers: UsuarioRapido[] = [
    { email: 'admin@clinic.com', password: '123', role: 'admin', pictureUrl: 'https://randomuser.me/api/portraits/thumb/men/10.jpg' },
    { email: 'esp1@clinic.com', password: '123', role: 'especialista', pictureUrl: 'https://randomuser.me/api/portraits/thumb/women/20.jpg' },
    { email: 'esp2@clinic.com', password: '123', role: 'especialista', pictureUrl: 'https://randomuser.me/api/portraits/thumb/men/30.jpg' },
    { email: 'pac1@clinic.com', password: '123', role: 'paciente', pictureUrl: 'https://randomuser.me/api/portraits/thumb/women/40.jpg' },
    { email: 'pac2@clinic.com', password: '123', role: 'paciente', pictureUrl: 'https://randomuser.me/api/portraits/thumb/men/50.jpg' },
    { email: 'pac3@clinic.com', password: '123', role: 'paciente', pictureUrl: 'https://randomuser.me/api/portraits/thumb/women/60.jpg' },
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {}

  quickLogin(user: UsuarioRapido): void {
    this.authService.login(user.email, user.role);
  }

  manualLogin(): void {
    if (this.email && this.password) {
      alert('Login manual en desarrollo. Use los botones de acceso rápido por ahora.');
    } else {
      alert('Por favor, ingrese email y contraseña.');
    }
  }
}