export interface UsuarioRapido {
  email: string;
  password: string;
  role: 'admin' | 'especialista' | 'paciente';
  pictureUrl: string; 
}