import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { TurnosService } from '../services/turnos.service';
import { UsuariosService } from '../services/usuarios.service';
import { Turno, TurnoEstado } from '../modelos/turno.interface';
import { FormsModule } from '@angular/forms';
import { HistoriaClinica, Usuario } from '../modelos/usuario.interface'; 
import { BorderStatusDirective } from '../directives/border-status.directive'; 
import { ScaleOnHoverDirective } from '../directives/scale-on-hover.directive'; 


@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [
        CommonModule, 
        DatePipe, 
        TitleCasePipe, 
        FormsModule, 
        BorderStatusDirective, 
        ScaleOnHoverDirective, 
        RouterModule,
    ],
    
    templateUrl: './mis-turnos.component.html', 
    styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent implements OnInit {
  turnosList: Turno[] = [];
  filteredTurnos: Turno[] = [];
 

  currentUser: any;
  userRole: string;
 
  filterQuery: string = '';
  filterPlaceholder: string = '';

  constructor(
    private turnosService: TurnosService,
    private usuariosService: UsuariosService,
    private router: Router 
  ) { 
    
    this.currentUser = this.usuariosService.getCurrentUser()!;
    this.userRole = this.currentUser.role;
}


  async ngOnInit() {
    await this.loadTurnos();
    this.setFilterPlaceholder();
  }
 
  setFilterPlaceholder(): void {
    if (this.userRole === 'paciente') {
      this.filterPlaceholder = 'Especialista';
   } else if (this.userRole === 'especialista') {
      this.filterPlaceholder = 'Paciente';
    } else {
      this.filterPlaceholder = 'Especialista, Paciente';
   }
  }

  async loadTurnos(): Promise<void> {
    try {

        this.turnosList = await this.turnosService.getTurnosPorUsuario(this.currentUser.uid, this.userRole);
        this.filteredTurnos = [...this.turnosList];
    } catch (e) {
      console.error("Error loading turnos:", e);
        this.turnosList = [];
        this.filteredTurnos = [];
    }
   }

  async applyFilter(): Promise<void> {
    if (!this.filterQuery) {
      this.filteredTurnos = [...this.turnosList];
   } else {

     this.filteredTurnos = await this.turnosService.searchTurnos(this.filterQuery, this.currentUser.uid, this.userRole);
   }
  }

  async cambiarEstado(id: string, nuevoEstado: TurnoEstado): Promise<void> {
   const success = await this.turnosService.cambiarEstadoTurno(id, nuevoEstado);
    if (success) {
     alert(`Turno ${id} actualizado a ${nuevoEstado}.`);
      await this.loadTurnos();
   }
  }

  async cancelarTurno(id: string, requesterRole: string): Promise<void> {
    const motivo = prompt('Ingrese el motivo de la cancelación:');
    if (motivo) {
    const success = await this.turnosService.cambiarEstadoTurno(id, 'cancelado', motivo);
    if (success) {
      alert('Turno cancelado con éxito.');
       await this.loadTurnos();
    }
   }
  }

  async rechazarTurno(id: string): Promise<void> {
    const motivo = prompt('Ingrese el motivo del rechazo:');
    if (motivo) {
    const success = await this.turnosService.cambiarEstadoTurno(id, 'rechazado', motivo);
     if (success) {
      alert('Turno rechazado con éxito.');
       await this.loadTurnos();
    }
   }
  }
 
  async openFinalizar(turno: Turno): Promise<void> {
  const resenaEspecialista = prompt('Ingrese reseña/diagnóstico (Requerido para finalizar):');
     if (resenaEspecialista) {
 // Creación de la Historia Clínica
        const hc: HistoriaClinica = {
            fecha: Date.now(),
            altura: 175,
            peso: 70,
            temperatura: 36.5,
            presion: '120/80',
            datosDinamicos: [{ clave: 'Alergias', valor: 'Polen' }],
            resenaEspecialista: resenaEspecialista,
            rango0a100: 85, 
            cuadroNumerico: 1500, 
            switchSiNo: true 
       };

        const success = await this.turnosService.finalizarTurno(turno.id, resenaEspecialista, hc);
          if (success) {
            alert('Turno finalizado y Historia Clínica guardada.');
            await this.loadTurnos();
     }
   } else {
     alert('Debe ingresar una reseña/diagnóstico para finalizar el turno.');
   }
  }

  verResena(turno: Turno): void {
    
    alert("Visualizando reseña y detalles del turno (HC).");
  }

  openCalificar(turno: Turno): void {
    
    alert("Abriendo modal para calificar atención.");
  }

   completarEncuesta(turno: Turno): void {
     this.router.navigate(['/encuesta', turno.id]);
 }
}