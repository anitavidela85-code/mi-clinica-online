import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 
import { UsuariosService, PerfilDB } from '../../services/usuarios.service';
import { DescargaService } from '../../services/descarga.service';
import { RolDisplayPipe } from '../../pipes/rol-display.pipe'; 
import { HighlightRoleDirective } from '../../directives/highlight-role.directive'; 
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../modelos/usuario.interface';



@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HighlightRoleDirective, RolDisplayPipe],
  templateUrl: './usuarios.component.html', 
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit { 
  
public usuariosList: any[] = []; 

  constructor(
    private usuariosService: UsuariosService,
    private descargaService: DescargaService
  ) { }

  async ngOnInit() {
    await this.loadUsers();
  }
  
  async loadUsers(): Promise<void> {
    try {
        this.usuariosList = await this.usuariosService.getUsuarios();
    } catch (e) {
        console.error('Error loading users:', e);
        this.usuariosList = [];
    }
  }

  
  async toggleHabilitacion(uid: string): Promise<void> {
    const user = this.usuariosList.find(u => u.id === uid);
    if (user) {
        
        await this.usuariosService.toggleHabilitarEspecialista(uid, user.habilitado); 
        await this.loadUsers(); 
    }
  }
  
  exportUsers(): void {
    
   this.descargaService.downloadUsuariosExcel(this.usuariosList, 'listado_usuarios');
    
  }
}