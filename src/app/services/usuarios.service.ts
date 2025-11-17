import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  
  
  constructor(private http: HttpClient) { }


  registerUser(userData: any, role: 'paciente' | 'especialista'): void {
    console.log(`Registrando ${role} con datos:`, userData);
    
  }


  getUsuarios() {
    
    console.log('Obteniendo lista de usuarios...');
    
  }
}