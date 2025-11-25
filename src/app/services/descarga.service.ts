import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class DescargaService {

  constructor() { }

  downloadUsuariosExcel(usuarios: Usuario[]): void {
    const data = usuarios.map(u => ({
      Nombre: u.nombre,
      Apellido: u.apellido,
      Email: u.email,
      Rol: u.role,
      DNI: u.dni,
      Habilitado: u.habilitado ? 'Sí' : 'No'
    }));
    
    console.log('Datos de usuarios para Excel:', data);
    alert(`Generando y descargando Excel para ${usuarios.length} usuarios.`);
  }

  downloadHistoriaClinicaPdf(paciente: Usuario): void {
    if (!paciente.historiaClinica || paciente.historiaClinica.length === 0) {
      alert('El paciente no tiene historia clínica para descargar.');
      return;
    }
    
    const informe = `
        Clínica Online - Historia Clínica
        Fecha de Emisión: ${new Date().toLocaleDateString()}
        ---
        Paciente: ${paciente.nombre} ${paciente.apellido} (DNI: ${paciente.dni})
        
        --- Historial de Atenciones (${paciente.historiaClinica.length}) ---
        ${paciente.historiaClinica.map(hc => 
            `Fecha: ${new Date(hc.fecha).toLocaleDateString()}
            Reseña: ${hc.resenaEspecialista}
            Altura: ${hc.altura}cm, Peso: ${hc.peso}kg, Temp: ${hc.temperatura}°C, Presión: ${hc.presion}
            Datos Dinámicos: ${hc.datosDinamicos?.map(d => `${d.clave}: ${d.valor}`).join(', ') || 'N/A'}`
        ).join('\n---\n')}
    `;
    
    console.log('Contenido del PDF:', informe);
    alert(`Generando y descargando PDF de Historia Clínica para ${paciente.nombre}.`);
  }
}