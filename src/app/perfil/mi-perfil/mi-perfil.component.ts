import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="perfil-container">
      <h1>Mi Perfil</h1>
      <p></p>
    </div>
  `,
  styles: []
})
export class MiPerfilComponent { }
