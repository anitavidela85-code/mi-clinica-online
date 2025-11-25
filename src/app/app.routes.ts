import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { MisTurnosComponent } from './turnos/mis-turnos.component'; 
import { MiPerfilComponent } from './perfil/mi-perfil/mi-perfil.component'; 
import { MisHorariosComponent } from './perfil/mis-horarios/mis-horarios.component'; 
import { UsuariosComponent } from './administrador/usuarios/usuarios.component'; 
import { SolicitarTurnoComponent } from './turnos/solicitar-turno/solicitar-turno.component'; 
import { EstadisticasComponent } from './administrador/estadisticas/estadisticas.component';
import { EncuestaAtencionComponent } from './encuestas/encuesta-atencion/encuesta-atencion.component';
import { Component } from '@angular/core';



@Component({ 
    template: '<h2>Bienvenido al sistema. Use el menú lateral para navegar.</h2>', 
    standalone: true 
})
export class HomeComponent {}

const authGuard = () => true;
const adminGuard = () => true;

export const routes: Routes = [
  
  { path: 'bienvenida', component: BienvenidaComponent, data: { animation: 'BienvenidaPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'registro', component: RegistroComponent, data: { animation: 'RegistroPage' } },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] }, 

  // Rutas Administrador
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard, adminGuard], data: { animation: 'UsuariosPage' } },
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [authGuard, adminGuard], data: { animation: 'EstadisticasPage' } },
 
  // Rutas Comunes (Paciente/Especialista)
  { path: 'mis-turnos', component: MisTurnosComponent, canActivate: [authGuard], data: { animation: 'TurnosPage' } },
  { path: 'solicitar-turno', component: SolicitarTurnoComponent, canActivate: [authGuard], data: { animation: 'SolicitarPage' } },
  { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [authGuard], data: { animation: 'PerfilPage' } },
  { path: 'mis-horarios', component: MisHorariosComponent, canActivate: [authGuard], data: { animation: 'HorariosPage' } },

  { path: 'encuesta/:id', component: EncuestaAtencionComponent, canActivate: [authGuard] },

  
 // Default Routes
  { path: '', redirectTo: '/bienvenida', pathMatch: 'full' },
  { path: '**', redirectTo: '/bienvenida' }
];