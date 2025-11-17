import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  
  { path: '', redirectTo: '/bienvenida', pathMatch: 'full' },
];
