import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuariosService, LogEntryDB } from '../../services/usuarios.service'; // Importar LogEntryDB
import { DescargaService } from '../../services/descarga.service';
import { TurnosService } from '../../services/turnos.service';
import { FormsModule } from '@angular/forms';
import { RolDisplayPipe } from '../../pipes/rol-display.pipe';
import { HighlightRoleDirective } from '../../directives/highlight-role.directive';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe'; 

type LogEntry = { email: string, role: string, timestamp: number }; 

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RolDisplayPipe, HighlightRoleDirective, TimeAgoPipe], 
  template: `
    <div class="stats-container">
      <h1>Estadísticas e Informes (Administrador)</h1>
      
      <button (click)="downloadAllReports()" class="btn-download">Descargar Todos los Informes (PDF)</button>
      
  
      <div class="report-card">
        <h2>Log de Ingresos al Sistema</h2>
        <table>
          <thead>
            <tr><th>Usuario</th><th>Rol</th><th>Hace cuánto</th><th>Fecha y Hora</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let entry of loginLogs">
              <td>{{ entry.email }}</td>
              <td [appHighlightRole]="entry.role">{{ entry.role | rolDisplay }}</td>
              <td>{{ entry.timestamp | timeAgo }}</td> 
              <td>{{ entry.timestamp | date:'dd/MM/yyyy HH:mm:ss' }}</td>
            </tr>
          </tbody>
        </table>
        <button (click)="downloadLog('excel')">Descargar Log (Excel)</button>
      </div>

    
      <div class="report-card">
        <h2>Cantidad de Turnos por Especialidad</h2>
        <div class="chart-placeholder">
          
        </div>
        <button (click)="downloadChartImage('turnos_por_esp')">Descargar Imagen</button>
      </div>
      
      <div class="report-card">
        <h2>Cantidad de Médicos por Especialidad</h2>
        <div class="chart-placeholder">
          
        </div>
        <button (click)="downloadChartImage('medicos_por_esp')">Descargar Imagen</button>
      </div>
      
      <div class="report-card">
        <h2>Informe de Encuesta (Sprint 6)</h2>
        <p>Calificación Promedio: 4.5/5</p>
        <p>Recomiendan la clínica: 90%</p>
      </div>
      
    </div>
  `,
  styles: [`
    .stats-container { max-width: 900px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
    .report-card { margin-top: 30px; padding: 20px; border: 1px solid #eee; border-radius: 6px; }
    h2 { color: #1e88e5; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
    .chart-placeholder { height: 200px; background-color: #e9ecef; border-radius: 4px; display: flex; justify-content: center; align-items: center; margin: 15px 0; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    button { padding: 8px 15px; margin-top: 10px; cursor: pointer; border: none; border-radius: 4px; background-color: #28a745; color: white; margin-right: 10px; }
    .btn-download { background-color: #dc3545; margin-bottom: 20px; }
  `]
})
export class EstadisticasComponent implements OnInit {
  
  loginLogs: LogEntry[] = []; 

  constructor(
    private usuariosService: UsuariosService,
    private descargaService: DescargaService,
    private turnosService: TurnosService
  ) { }

  
  async ngOnInit(): Promise<void> {
    await this.generateLoginLogs();
  }

  
  async generateLoginLogs(): Promise<void> {
    try {
        const logs: LogEntryDB[] = await this.usuariosService.getLogIngresosFromDB();
        
        
        this.loginLogs = logs.map(log => ({
            email: log.email,
            role: log.role,
            
            timestamp: new Date(log.fecha_ingreso).getTime() 
        }));
        
        
        this.loginLogs.sort((a, b) => b.timestamp - a.timestamp);
        
    } catch (e: any) {
        console.error("Error fetching logs:", e.message);
        this.loginLogs = [];
    }
  }
  
  downloadLog(format: 'excel' | 'pdf'): void {
      alert(`Simulando descarga de Log de Ingresos en ${format.toUpperCase()}.`);
  }
  
  downloadAllReports(): void {
      alert('Simulando descarga de todos los informes.');
  }
  
  downloadChartImage(chartName: string): void {
      alert(`Simulando descarga de imagen del gráfico: ${chartName}.`);
  }
}