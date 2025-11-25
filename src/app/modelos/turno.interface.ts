import { HistoriaClinica, UserRole } from "./usuario.interface";

export type TurnoEstado = 'pendiente' | 'aceptado' | 'rechazado' | 'cancelado' | 'realizado';

export interface Turno {
  id: string;
  pacienteUid: string;
  especialistaUid: string;
  especialidad: string;
  fecha: number; 
  duracionMinutos: number; 
  estado: TurnoEstado;
  
  // Comentarios y reseñas
  comentarioCancelacion?: string; 
  comentarioRechazo?: string; 
  resenaPaciente?: string; 
  
  
  historiaClinica?: HistoriaClinica;
  
  
  encuestaCompletada: boolean;
  calificacionAtencion?: number; 
  

  pacienteNombre: string;
  especialistaNombre: string;
}
