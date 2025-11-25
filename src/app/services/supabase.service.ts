import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
 providedIn: 'root'
})
export class SupabaseService {

 
  public readonly supabase: SupabaseClient = supabase;

  constructor() {
 
    console.log('✅ Supabase Client Initialized. URL:', environment.supabaseUrl);
    
    // Monitoreo del estado de la sesión
    supabase.auth.onAuthStateChange((event, session) => {
 
    if (event === 'SIGNED_OUT') {
           console.log('🚨 Supabase Session Closed.');
        } else {
            console.log('Supabase Auth Event:', event, session);
        }
   });
  }
}