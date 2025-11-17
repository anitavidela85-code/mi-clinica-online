import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterModule, MatButtonModule,MatIconModule ], 
  template: `
    <div class="welcome-container mat-elevation-z4">
      <mat-icon aria-hidden="false" aria-label="Medical icon">local_hospital</mat-icon>
      <h1>Bienvenido a Clínica Online</h1>
      <p class="subtitle">Su portal de salud digital.</p>
      
      <nav class="button-group">
        <button 
          mat-raised-button 
          color="primary" 
          [routerLink]="['/login']">
          <mat-icon>login</mat-icon> Iniciar Sesión
        </button>
        <button 
          mat-raised-button 
          color="accent" 
          [routerLink]="['/registro']">
          <mat-icon>person_add</mat-icon> Registrarse
        </button>
      </nav>
    </div>
  `,
  styles: [`
    .welcome-container {
      max-width: 500px;
      margin: 100px auto;
      padding: 40px;
      border-radius: 12px;
      background-color: #f7f9fc;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #3f51b5; /* Primary color */
      font-size: 2.2em;
      margin-bottom: 0.5em;
    }
    .subtitle {
      color: #555;
      font-size: 1.2em;
      margin-bottom: 30px;
    }
    .button-group {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
    }
  `]
})
export class BienvenidaComponent { }