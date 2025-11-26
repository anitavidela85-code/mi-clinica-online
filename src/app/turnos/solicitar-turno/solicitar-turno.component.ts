import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, PerfilDB } from '../../services/usuarios.service';
import { TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../modelos/usuario.interface';


@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],

  template: `
    <div class="turno-form-container">
         <h1>Solicitar Turno</h1>
 
        <form (ngSubmit)="solicitar()">

            @if (isUserAdmin) {
               <div class="form-group">
                <label>Paciente:</label>
                <select [(ngModel)]="selectedPacienteUid" name="pacienteUid" required>
                <option [ngValue]="null" disabled>Seleccione Paciente</option>
                    @for (p of pacientes; track p.uid) {
                      <option [value]="p.uid">{{ p.nombre }} {{ p.apellido }} ({{ p.email }})</option>
                    }
               </select>
             </div>
            }
 
                <div class="form-group">
                <label>Especialidad:</label>
                <select [(ngModel)]="selectedEspecialidad" (change)="filterEspecialistas()" name="especialidad" required>
                  <option [ngValue]="null" disabled>Seleccione Especialidad</option>
                    @for (esp of especialidades; track esp) {
                     <option [value]="esp">{{ esp }}</option>
                    }
                </select>
              </div>

            @if (filteredEspecialistas.length > 0) {
              <div class="form-group">
                <label>Especialista:</label>
                <select [(ngModel)]="selectedEspecialistaUid" (change)="loadDisponibilidad()" name="especialista" required>
                <option [ngValue]="null" disabled>Seleccione Especialista</option>
                    @for (esp of filteredEspecialistas; track esp.uid) {
                      <option [value]="esp.uid">{{ esp.nombre }} {{ esp.apellido }}</option>
                    }
                </select>
             </div>
            } 
           
            @if (availableDates.length > 0) {
            <div class="form-group">
                <label>Día y Horario:</label>
                  <div class="date-options">
                    @for (date of availableDates; track date) {
                          <button 
                        [class.active]="selectedDate === date"
                        (click)="selectedDate = date"
                         type="button">
                        {{ date | date:'EEE dd/MM' }} a las {{ date | date:'HH:mm' }}h
                     </button>
                    }
                </div>
             </div>
            }
 
         <button type="submit" [disabled]="!selectedDate">Solicitar Turno</button>
      </form>
    </div>
 `,
 styles: [`
    .turno-form-container { max-width: 600px; margin: 50px auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
    .form-group { margin-bottom: 20px; text-align: left; }
    label { display: block; font-weight: bold; margin-bottom: 5px; }
    select, button[type="submit"] { width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ccc; }
    .date-options { display: flex; flex-wrap: wrap; gap: 10px; max-height: 200px; overflow-y: auto; }
    .date-options button { flex-grow: 1; padding: 8px; background-color: #e9ecef; border: 1px solid #ddd; cursor: pointer; }
    .date-options button.active { background-color: #007bff; color: white; border-color: #007bff; }
    button[type="submit"] { background-color: #28a745; color: white; margin-top: 15px; cursor: pointer; }
    button[type="submit"]:disabled { background-color: #6c757d; cursor: not-allowed; }
  `]
})
export class SolicitarTurnoComponent implements OnInit {
  isUserAdmin: boolean = false;
  especialidades: string[] = [];
  allEspecialistas: Usuario[] = []; 
  filteredEspecialistas: Usuario[] = [];
  pacientes: Usuario[] = [];
  selectedEspecialidad: string | null = null;
  selectedEspecialistaUid: string | null = null;
  selectedPacienteUid: string | null = null;
  selectedDate: number | null = null;
  
  availableDates: number[] = [];

  constructor(
    private usuariosService: UsuariosService, 
    private turnosService: TurnosService,
) { }

  async ngOnInit(): Promise<void> {
    this.isUserAdmin = this.usuariosService.getRole() === 'administrador';
 
    try {

        const allUsers = await this.usuariosService.getUsuarios();
        this.allEspecialistas = await this.usuariosService.getEspecialistas(); 

          this.pacientes = allUsers.filter(u => u.role === 'paciente');
  
        if (this.usuariosService.getRole() === 'paciente') {
            this.selectedPacienteUid = this.usuariosService.getCurrentUser()?.uid || null;
        } else {
            this.selectedPacienteUid = null;  

}
        const allEspecialidades = await this.usuariosService.getEspecialistas();
        const listaSoloNombres = allEspecialidades.map((item: any) => {
  return typeof item === 'string' ? item : item.especialidad;
});
      this.filteredEspecialistas = this.allEspecialistas;


   } catch (error) {
       console.error('Error loading initial form data:', error);
        alert('Error al cargar datos iniciales. Verifique la conexión a Supabase.');
 }
  }
  
 
  filterEspecialistas(): void {
   if (this.selectedEspecialidad) {
      this.filteredEspecialistas = this.allEspecialistas.filter(e => 
      e.especialidades?.includes(this.selectedEspecialidad!)
  );
      this.selectedEspecialistaUid = null;
      this.availableDates = [];
      this.selectedDate = null;
   }
  }
 
  async loadDisponibilidad(): Promise<void> {
     if (this.selectedEspecialistaUid && this.selectedEspecialidad) {
        const next15Days = Array.from({ length: 15 }, (_, i) => Date.now() + 86400000 * i);

           this.availableDates = await this.turnosService.getDisponibilidad(
              this.selectedEspecialidad, 
              this.selectedEspecialistaUid, 
            next15Days
 );
           this.selectedDate = null;
 }
 }
 
  async solicitar(): Promise<void> {
     if (!this.selectedPacienteUid || !this.selectedEspecialistaUid || !this.selectedEspecialidad || !this.selectedDate) {
       alert('Por favor, complete todos los campos.');
       return;
 }
 
    try {
      
      await this.turnosService.solicitarTurno(
              this.selectedPacienteUid, 
               this.selectedEspecialistaUid,  
               this.selectedEspecialidad, 
               this.selectedDate

               );

        alert('Turno solicitado con éxito. Estado: Pendiente.'); 
        this.resetForm();
      } catch (e: any) {
        alert(`Error al solicitar el turno: ${e.message}`);
      }
 }

  private resetForm(): void {
      
     this.selectedEspecialidad = null;
      this.selectedEspecialistaUid = null;
       this.selectedDate = null; 
       this.availableDates = [];
       this.filteredEspecialistas = [];
    if (this.isUserAdmin) {
      this.selectedPacienteUid = null;
 }
 }
}