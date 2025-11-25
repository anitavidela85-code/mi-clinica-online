export interface HistoriaClinica {
  fecha: number; 
  altura: number; 
  peso: number; 
  temperatura: number; 
  presion: string; 
  resenaEspecialista: string; 
  datosDinamicos?: { clave: string, valor: string | number }[];
  rango0a100?: number;
  cuadroNumerico?: number;
  switchSiNo?: boolean;
}