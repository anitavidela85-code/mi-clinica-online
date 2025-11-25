import { Injectable } from '@angular/core';
import { Turno, TurnoEstado } from '../modelos/turno.interface';
import { HistoriaClinica } from '../modelos/historia-clinica.interface'; 
import { UsuariosService, PerfilDB } from './usuarios.service';
import { SupabaseService } from './supabase.service'; 

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(
    private usuariosService: UsuariosService,
    private supabaseService: SupabaseService 
) { }
  
    // Helper para mapear DB a la Interfaz de Angular 

    private mapTurno(dbData: any): Turno {
        
        const pacienteData = dbData.paciente[0];
        const especialistaData = dbData.especialista[0];

        return {
            id: dbData.id,
            pacienteUid: dbData.paciente_id,
            especialistaUid: dbData.especialista_id,
            especialidad: dbData.especialidad,
            fecha: new Date(dbData.fecha).getTime(), 
            duracionMinutos: dbData.duracion_minutos || 30, 
            estado: dbData.estado as TurnoEstado,
            comentarioCancelacion: dbData.comentario_cancelacion,
            comentarioRechazo: dbData.comentario_rechazo,
            resenaPaciente: dbData.resena_paciente,
            encuestaCompletada: dbData.encuesta_completada,
            calificacionAtencion: dbData.calificacion_atencion,
            
            
            historiaClinica: dbData.historia_clinica as HistoriaClinica, 

            
            pacienteNombre: `${pacienteData.nombre} ${pacienteData.apellido}`,
            especialistaNombre: `${especialistaData.nombre} ${especialistaData.apellido}`,
        };
    }


    
    async getTurnosPorUsuario(uid: string, role: string): Promise<Turno[]> {
        
        let query = this.supabaseService.supabase.from('turnos').select(`
            *,
            paciente:perfiles!turnos_paciente_id_fkey(nombre, apellido),
            especialista:perfiles!turnos_especialista_id_fkey(nombre, apellido)
        `);

        
        if (role === 'paciente') {
            query = query.eq('paciente_id', uid);
        } else if (role === 'especialista') {
            query = query.eq('especialista_id', uid);
        } 

        const { data, error } = await query.order('fecha', { ascending: true });

        if (error) {
            console.error("Error fetching turnos:", error);
            throw new Error("Error al cargar los turnos.");
        }
        
        return data.map(t => this.mapTurno(t));
    }
    
    
    async getDisponibilidad(especialidad: string, especialistaUid: string, dias: number[]): Promise<number[]> {
        
        await new Promise(resolve => setTimeout(resolve, 50)); 
        const mockDates: number[] = [];
        for (let i = 1; i <= 7; i++) {
            const baseTime = Date.now() + 86400000 * i;
            mockDates.push(baseTime + 3600000 * 9); 
            mockDates.push(baseTime + 3600000 * 11); 
            mockDates.push(baseTime + 3600000 * 15); 
        }
        return mockDates.filter(ts => ts <= Date.now() + 86400000 * 15);
    }
    
    
    async solicitarTurno(pacienteUid: string, especialistaUid: string, especialidad: string, fecha: number): Promise<void> {
        
        const newTurno = {
            paciente_id: pacienteUid,
            especialista_id: especialistaUid,
            especialidad: especialidad,
            fecha: new Date(fecha).toISOString(),  
            duracion_minutos: 30, 
            estado: 'pendiente'
        };

        const { error } = await this.supabaseService.supabase
            .from('turnos')
            .insert(newTurno as any);
            
        if (error) throw new Error(`Error al solicitar turno: ${error.message}`);
    }

    
    async cambiarEstadoTurno(id: string, nuevoEstado: TurnoEstado, comentario?: string): Promise<boolean> {
        let updateFields: any = { estado: nuevoEstado };

        if (nuevoEstado === 'cancelado') {
            updateFields.comentario_cancelacion = comentario;
        } else if (nuevoEstado === 'rechazado') {
            updateFields.comentario_rechazo = comentario;
        }
        
        const { error } = await this.supabaseService.supabase
            .from('turnos')
            .update(updateFields)
            .eq('id', id);

        if (error) {
            console.error(`Error al cambiar estado del turno ${id}:`, error);
            return false;
        }
        return true;
    }
    
    
    async finalizarTurno(turnoId: string, resenaEspecialista: string, hcData: HistoriaClinica): Promise<boolean> {
        
        
        const hcJsonb: Partial<any> = {
            fecha: new Date(hcData.fecha).toISOString(),
            altura: hcData.altura,
            peso: hcData.peso,
            temperatura: hcData.temperatura,
            presion: hcData.presion,
            resena_especialista: resenaEspecialista,
            datos_dinamicos: hcData.datosDinamicos,
            rango_0a100: hcData.rango0a100,
            cuadro_numerico: hcData.cuadroNumerico,
            switch_si_no: hcData.switchSiNo,
        };

        
        const { error: updateError } = await this.supabaseService.supabase
            .from('turnos')
            .update({ 
                estado: 'realizado', 
                historia_clinica: hcJsonb 
            })
            .eq('id', turnoId);

        if (updateError) throw new Error(`Error al finalizar el turno y guardar HC: ${updateError.message}`);
        
        return true;
    }


    async searchTurnos(query: string, uid: string, role: string): Promise<Turno[]> {
        const lowerQuery = `%${query.toLowerCase()}%`;

        
        let baseQuery = this.supabaseService.supabase.from('turnos').select(`
            *,
            paciente:perfiles!turnos_paciente_id_fkey(nombre, apellido),
            especialista:perfiles!turnos_especialista_id_fkey(nombre, apellido)
        `);

        
        if (role === 'paciente') {
            baseQuery = baseQuery.eq('paciente_id', uid);
        } else if (role === 'especialista') {
            baseQuery = baseQuery.eq('especialista_id', uid);
        } 

        
        const { data, error } = await baseQuery.or(
            `
            especialidad.ilike.${lowerQuery}, 
            estado.ilike.${lowerQuery},
            resena_paciente.ilike.${lowerQuery},
            comentario_cancelacion.ilike.${lowerQuery},
            comentario_rechazo.ilike.${lowerQuery}
            `
        );

        if (error) {
            console.error("Error searching turnos:", error);
            throw new Error("Error en la búsqueda de turnos.");
        }

        return data.map(t => this.mapTurno(t));
    }
}