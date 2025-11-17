import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsuariosService } from './services/usuarios.service'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatIconModule,MatButtonModule], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' 
})
export class AppComponent implements OnInit {
  
  
  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    
     this.usuariosService.getUsuarios();
  }
}