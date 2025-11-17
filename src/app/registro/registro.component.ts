import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './registro.component.html', 
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  
  selectedRole: 'paciente' | 'especialista' | null = null;
  registrationForm!: FormGroup; 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
      
      // Campos específicos para el Paciente
      obraSocial: [''], 
      imagenesPerfil: [null], 
      
      // Campos específicos para el Especialista
      especialidad: [''],
      
      // Control para el Captcha 
      captcha: [false, Validators.requiredTrue] 
    });
  }

  selectRole(role: 'paciente' | 'especialista'): void {
    this.selectedRole = role;
    this.updateFormValidation(role);
  }

  // Lógica para actualizar las validaciones según el rol 
  private updateFormValidation(role: 'paciente' | 'especialista'): void {
    const obraSocialControl = this.registrationForm.get('obraSocial');
    const especialidadControl = this.registrationForm.get('especialidad');
    const imagenesPerfilControl = this.registrationForm.get('imagenesPerfil');
    
    
    obraSocialControl?.clearValidators();
    especialidadControl?.clearValidators();
    imagenesPerfilControl?.clearValidators();

    if (role === 'paciente') {
      obraSocialControl?.setValidators(Validators.required);
      imagenesPerfilControl?.setValidators(Validators.required); 
    } else if (role === 'especialista') {
      especialidadControl?.setValidators(Validators.required);
    
    }

    obraSocialControl?.updateValueAndValidity();
    especialidadControl?.updateValueAndValidity();
    imagenesPerfilControl?.updateValueAndValidity();
  }

  // Manejar la selección de archivos
  onFileSelect(event: any, controlName: string): void {
    if (event.target.files.length > 0) {
      this.registrationForm.get(controlName)?.setValue(event.target.files);
    } else {
      this.registrationForm.get(controlName)?.setValue(null);
    }
  }

  submitRegistration(): void {
    if (this.registrationForm.valid) {
      console.log('Datos de Registro:', this.registrationForm.value);
      alert(`Simulando registro de ${this.selectedRole}. Pendiente: integrar con Firebase Auth y Firestore.`);
      // **AQUÍ IRÍA LA LÓGICA DE FIREBASE AUTH y FIRESTORE**
    } else {
      this.registrationForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      alert('Por favor, complete todos los campos requeridos y el Captcha correctamente.');
    }
  }
}