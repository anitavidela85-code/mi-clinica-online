import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { UserRole } from '../modelos/usuario.interface'; 
import { CaptchaDirective } from '../directives/captcha.directive'; 
import { TranslatePipe } from '../pipes/translate.pipe'; 


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TitleCasePipe, CaptchaDirective, TranslatePipe],
  template: `
   <div class="registration-view">
      <h1>{{ 'registration_title' | translate }}</h1>

       <p>Seleccione el tipo de cuenta:</p>
     <div class="registration-options">
        <button (click)="selectRole('paciente')" [class.active]="selectedRole === 'paciente'">{{ 'role_paciente' | translate }}</button>
        <button (click)="selectRole('especialista')" [class.active]="selectedRole === 'especialista'">{{ 'role_especialista' | translate }}</button>
        <button (click)="selectRole('administrador')" [class.active]="selectedRole === 'administrador'">{{ 'role_administrador' | translate }}</button>
     </div>

     <div *ngIf="selectedRole" class="registration-form">
         <h2>Formulario de Registro: {{ selectedRole | titlecase }}</h2>

         <form (ngSubmit)="submitRegistration()" #registrationForm="ngForm" 
               appCaptcha [captchaDisabled]="captchaDisabled" (captchaSolved)="isCaptchaSolved = $event">

          <input type="text" [(ngModel)]="userData.nombre" name="nombre" placeholder="Nombre" required>
          <input type="text" [(ngModel)]="userData.apellido" name="apellido" placeholder="Apellido" required>
          <input type="number" [(ngModel)]="userData.edad" name="edad" placeholder="Edad" required min="18" max="120">
          <input type="text" [(ngModel)]="userData.dni" name="dni" placeholder="DNI" required pattern="[0-9]{7,8}">
          <input type="email" [(ngModel)]="userData.email" name="email" placeholder="Mail" required>
             <input type="password" [(ngModel)]="userData.password" name="password" placeholder="Contraseña" required minlength="6">

          <div *ngIf="selectedRole === 'paciente'">
            <input type="text" [(ngModel)]="userData.obraSocial" name="obraSocial" placeholder="Obra Social" required>
            <label>Subir 2 imágenes:</label>
            <input type="file" required multiple (change)="onFileChange($event, 2)"> 
          </div>

          <div *ngIf="selectedRole === 'especialista'">
            <select [(ngModel)]="userData.especialidad" name="especialidad" required>
            <option [ngValue]="null" disabled>Seleccione Especialidad</option>
                <option *ngFor="let esp of availableEspecialidades" [value]="esp">{{ esp }}</option>
            </select>
            <input *ngIf="userData.especialidad === 'Otra'" type="text" [(ngModel)]="userData.nuevaEspecialidad" name="nuevaEspecialidad" placeholder="Escriba la nueva especialidad" required>
            <label>Subir Imagen de Perfil:</label>
            <input type="file" required (change)="onFileChange($event, 1)"> 
             </div>
 
         <div *ngIf="selectedRole === 'administrador'">
          <label>Subir Imagen de Perfil:</label>
              <input type="file" required (change)="onFileChange($event, 1)"> 
            </div>


           <p class="captcha-placeholder">
              **[CAPCHA PROPIO AQUÍ]**
          </p>
 
          <div class="form-check">
          <input type="checkbox" id="disableCaptcha" [(ngModel)]="captchaDisabled" name="disableCaptcha">
            <label for="disableCaptcha">Deshabilitar Captcha</label>
          </div>

         <button type="submit" [disabled]="!isCaptchaSolved || registrationForm.invalid">
            Registrar {{ selectedRole | titlecase }}
          </button>
        </form>
 
        <p class="verification-note">
          <br>
          - El especialista requiere **aprobación del administrador** y verificación de email.
          <br>
          - El paciente requiere **verificación de email** para ingresar.
        </p>
     </div>
 
   <p class="mt-3"><a [routerLink]="['/login']">{{ 'back_to_login' | translate }}</a></p>
  </div>
`,
  
})
export class RegistroComponent implements OnInit {
  selectedRole: UserRole | null = null;
  userData: any = {};
  availableEspecialidades: string[] = [];
 
  isCaptchaSolved: boolean = false;
  captchaDisabled: boolean = false;

  constructor(private usuariosService: UsuariosService, private router: Router) {

  }

  async ngOnInit(): Promise<void> {
    await this.loadEspecialidades();
  }

  // Función asíncrona para cargar especialidades
  async loadEspecialidades(): Promise<void> {
    try {
        
        const especialidades = await this.usuariosService.getEspecialidades(); 
        this.availableEspecialidades = [...especialidades, 'Otra'];
    } catch (e) {
        console.error('Error loading specialties:', e);
        this.availableEspecialidades = ['Error de carga', 'Otra'];
    }
  }
 
  selectRole(role: UserRole): void {
    this.selectedRole = role;
    this.userData = { 
        email: '', password: '', nombre: '', apellido: '', edad: null, dni: '', 
        obraSocial: '', especialidad: null, nuevaEspecialidad: '', pictureUrl: ''
 };
  }
  
  onFileChange(event: any, maxFiles: number): void {

        if (event.target.files && event.target.files.length > 0) {
          if (maxFiles === 1) {
          this.userData.pictureUrl = 'https://picsum.photos/50/50?random=' + Date.now();
          } else if (maxFiles === 2) {
            this.userData.imagenes = ['https://picsum.photos/50/50?random=' + (Date.now() + 1), 'https://picsum.photos/50/50?random=' + (Date.now() + 2)];
 }
          console.log('Archivos subidos (simulado)');
 }
 }

  async submitRegistration(): Promise<void> {
    if (!this.selectedRole) {
      alert('Por favor, seleccione un rol.');
      return;
    }
    
    // Asignar especialidad final
    if (this.selectedRole === 'especialista') {
        this.userData.especialidad = this.userData.nuevaEspecialidad || this.userData.especialidad;
        if (this.userData.especialidad === 'Otra' || !this.userData.especialidad) {
            alert('Por favor, ingrese o seleccione una especialidad válida.');
            return;
        }
    }
    
    try {
        await this.usuariosService.registerUser(this.userData, this.selectedRole);
        alert(`Registro exitoso de ${this.selectedRole}. Se requiere verificación de email. Será redirigido al login.`);
        this.router.navigate(['/login']);
    } catch (e: any) {
        alert(`Error en el registro: ${e.message}`);
    }
  }
}