import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario, UserRole, HistoriaClinica, HorarioEspecialista } from '../modelos/usuario.interface';
import { SupabaseService } from './supabase.service'; 
import { AuthSession, User } from '@supabase/supabase-js';


export type PerfilDB = {
    id: string; 
    nombre: string;
    apellido: string;
    dni: string;
    edad: number;
    role: UserRole;
    is_approved: boolean; 
    habilitado: boolean;
    especialidades: string[];
    horarios: HorarioEspecialista[]; 
    obra_social: string;
    imagenes_paciente: string[];
    perfil_image_url: string;
    email: string; 
    email_confirmed_at: string | null; 
};

export type LogEntryDB = { 
    email: string; 
    role: string; 
    fecha_ingreso: string; 
};

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
 currentUser = signal<Usuario | null>(null);

    constructor(
        private http: HttpClient,
        private supabaseService: SupabaseService 
 ) { 
     this.loadCurrentSession();
 }

    private mapPerfilDBToUsuario(perfilDB: PerfilDB): Usuario {
        return {
            uid: perfilDB.id,
            nombre: perfilDB.nombre,
            apellido: perfilDB.apellido,
            edad: perfilDB.edad,
            dni: perfilDB.dni,
            email: perfilDB.email,
            password: '', 
            role: perfilDB.role,
            aprobado: perfilDB.is_approved,
            habilitado: perfilDB.habilitado,
            perfilImageUrl: perfilDB.perfil_image_url || 'default.jpg',
            emailVerificado: !!perfilDB.email_confirmed_at, 

            logIngresos: [], 
            obraSocial: perfilDB.obra_social,
            imagenesPaciente: perfilDB.imagenes_paciente,
            especialidades: perfilDB.especialidades,
            horarios: perfilDB.horarios,
            historiaClinica: [] 
        } as Usuario;
    }

    private async loadCurrentSession(): Promise<void> {
        const { data: sessionData } = await this.supabaseService.supabase.auth.getSession();

        if (sessionData.session) {
           const authUser = sessionData.session.user;
           await this.fetchAndSetProfile(authUser.id, authUser.email, authUser.email_confirmed_at); 
      } else {
           this.currentUser.set(null);
 }
 }

    private async fetchAndSetProfile(
        userId: string, 
        email: string | undefined | null, 
        emailConfirmedAt: string | null | undefined 
    ): Promise<Usuario | null> {
 
       if (!email) return null;

        const { data: perfilData, error: profileError } = await this.supabaseService.supabase
            .from('perfiles')
            .select('*, email:auth_users(email), email_confirmed_at:auth_users(email_confirmed_at)') 
            .eq('id', userId)
            .single();

        if (profileError || !perfilData) {
         console.error('Error al cargar perfil:', profileError?.message);
         return null;
 }

      const fullUser: Usuario = {
            uid: perfilData.id,
            nombre: perfilData.nombre,
            apellido: perfilData.apellido,
            edad: perfilData.edad,
            dni: perfilData.dni,
            email: email, 
            password: '', 
            role: perfilData.role,
            aprobado: perfilData.is_approved,
            emailVerificado: !!emailConfirmedAt, 
            habilitado: perfilData.habilitado, 
            perfilImageUrl: perfilData.perfil_image_url || 'default.jpg',
            logIngresos: [], 
            obraSocial: perfilData.obra_social,
            imagenesPaciente: perfilData.imagenes_paciente,
            historiaClinica: [],
            especialidades: perfilData.especialidades,
            horarios: perfilData.horarios,
        };

    this.currentUser.set(fullUser);


        await this.supabaseService.supabase.from('log_ingresos').insert({ 
            usuario_id: userId, 
            email: email, 
            role: perfilData.role 
      } as any);
 
  return fullUser;
}


    async login(email: string, password: string): Promise<{ success: boolean, message: string, user: Usuario | null }> {
        
        const { data: authData, error: authError } = await this.supabaseService.supabase.auth.signInWithPassword({ email, password });
        if (authError) return { success: false, message: authError.message || 'Error de credenciales.', user: null };

        const authUser = authData.user!;
        const user = await this.fetchAndSetProfile(authUser.id, authUser.email, authUser.email_confirmed_at);
        if (!user) return { success: false, message: 'Perfil no encontrado o error de carga.', user: null };
        
        if (user.role === 'especialista' && (!user.aprobado || !user.emailVerificado)) return { success: false, message: 'Acceso denegado. Su cuenta requiere aprobación de administrador y/o verificación de email.', user: null };
        if (user.role !== 'administrador' && !user.emailVerificado) return { success: false, message: 'Acceso denegado. Su cuenta requiere verificación de email.', user: null };
        if (!user.habilitado) return { success: false, message: 'Su cuenta ha sido inhabilitada por un administrador.', user: null };
        
        return { success: true, message: 'Login exitoso.', user };
 }


    //  Logout 
    async logout(): Promise<void> {
        this.currentUser.set(null);
        await this.supabaseService.supabase.auth.signOut();
  }


   // Registro
   async registerUser(userData: any, role: UserRole): Promise<void> {
        
        const { data: authData, error: authError } = await this.supabaseService.supabase.auth.signUp({ email: userData.email, password: userData.password, options: { data: { user_role: role } } });
        if (authError) throw new Error(authError.message);

        if (authData.user) {
            const newProfile: Partial<PerfilDB> = {
                id: authData.user.id,
                nombre: userData.nombre,
                apellido: userData.apellido,
                edad: +userData.edad,
                dni: userData.dni,
                role: role,
                is_approved: role === 'administrador' ? true : false,
                habilitado: true, 
                perfil_image_url: userData.pictureUrl || 'default.jpg',
                obra_social: role === 'paciente' ? userData.obraSocial : null as any,
                imagenes_paciente: role === 'paciente' ? userData.imagenes : [] as any,
                especialidades: role === 'especialista' ? [userData.especialidad] : [] as any,
                horarios: role === 'especialista' ? [] : [] as any,
            };
            const { error: profileError } = await this.supabaseService.supabase.from('perfiles').insert(newProfile as any);
            
            if (profileError) throw new Error(`Error al crear perfil: ${profileError.message}. Consulte la consola para la solución de seguridad.`);
            
            console.log(`Usuario ${role} registrado y perfil creado. Requiere verificación de email.`);
        }
 }


async getUsuarios(): Promise<Usuario[]> {
     const { data, error } = await this.supabaseService.supabase
       .from('perfiles')
             
       .select(`*, email:auth_users(email), email_confirmed_at:auth_users(email_confirmed_at)`);

    if (error) throw new Error(error.message);
        return data.map(perfil => this.mapPerfilDBToUsuario(perfil as any));
}

    async getEspecialistas(): Promise<Usuario[]> {
        const { data, error } = await this.supabaseService.supabase
            .from('perfiles')
            .select(`*, email:auth_users(email), email_confirmed_at:auth_users(email_confirmed_at)`)
            .eq('role', 'especialista')
            .eq('is_approved', true)
            .eq('habilitado', true);

        if (error) throw new Error(`Error al obtener especialistas: ${error.message}`);
        
        return data.map(perfil => this.mapPerfilDBToUsuario(perfil as any));
    }
    
    
     getRole(): UserRole | null {
    return this.currentUser()?.role || null;
 }

    getCurrentUser(): Usuario | null {
     return this.currentUser();
}
}