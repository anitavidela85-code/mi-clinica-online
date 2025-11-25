export type UserRole = 'administrador' | 'especialista' | 'paciente';

export interface HistoriaClinica {
  fecha: number; 
  altura: number; 
  peso: number;
  temperatura: number; 
  presion: string; 
  
  datosDinamicos?: { clave: string, valor: string | number }[];
  
  rango0a100?: number;
  cuadroNumerico?: number;
  switchSiNo?: boolean;
  

  resenaEspecialista: string; 
}

export interface HorarioEspecialista {
  dia: string; 
  horarioDesde: number; 
  horarioHasta: number; 
  especialidad: string;
}

export interface Usuario {
  uid: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: string;
  email: string;
  password: string;
  role: UserRole;
  
  // Específicos de Paciente
  obraSocial?: string;
  imagenesPaciente?: string[]; 
  historiaClinica?: HistoriaClinica[]; 
  
  // Específicos de Especialistas
  especialidades?: string[];
  horarios?: HorarioEspecialista[]; 
  aprobado: boolean;
  
  
  perfilImageUrl: string;
  emailVerificado: boolean; 
  habilitado: boolean; 
  
  
  logIngresos: number[]; 
}