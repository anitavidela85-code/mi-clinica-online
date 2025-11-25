import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-encuesta-atencion',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="survey-container">
      <h1>Encuesta de Satisfacción </h1>
      <p>Ayúdenos a mejorar calificando su atención.</p>

      <form (ngSubmit)="submitSurvey()">
        
        <div class="form-group">
          <label>Comentario General:</label>
          <textarea rows="4" [(ngModel)]="surveyData.comentario" name="comentario" required></textarea>
        </div>

        <div class="form-group">
          <label>Calidad del Servicio (Estrellas): {{ surveyData.estrellas }}</label>
          <div class="star-rating">
            <span *ngFor="let star of [5,4,3,2,1]" 
                  (click)="surveyData.estrellas = star" 
                  [class.filled]="surveyData.estrellas >= star">
              ★
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>¿El especialista resolvió su consulta?</label>
          <div class="radio-group">
            <input type="radio" id="resuelto-si" [value]="true" [(ngModel)]="surveyData.resuelto" name="resuelto" required>
            <label for="resuelto-si">Sí</label>
            <input type="radio" id="resuelto-no" [value]="false" [(ngModel)]="surveyData.resuelto" name="resuelto">
            <label for="resuelto-no">No</label>
          </div>
        </div>

        <div class="form-group">
          <input type="checkbox" id="recomienda" [(ngModel)]="surveyData.recomienda" name="recomienda">
          <label for="recomienda">Recomendaría Clínica Online a un amigo.</label>
        </div>

        <div class="form-group">
          <label>Tiempo de espera percibido (0=Rápido, 10=Lento): {{ surveyData.tiempoEspera }}</label>
          <input type="range" min="0" max="10" [(ngModel)]="surveyData.tiempoEspera" name="tiempoEspera" required>
        </div>

        <button type="submit">Enviar Encuesta</button>
      </form>
    </div>
  `,
  styles: [`
    .survey-container { max-width: 500px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
    .form-group { margin-bottom: 15px; text-align: left; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    textarea, input[type="text"], input[type="number"], input[type="range"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .radio-group input { width: auto; margin-right: 5px; }
    .star-rating { display: flex; flex-direction: row-reverse; justify-content: flex-end; }
    .star-rating span { font-size: 24px; cursor: pointer; color: #ccc; transition: color 0.2s; }
    .star-rating span.filled { color: gold; }
    button[type="submit"] { background-color: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 20px; width: 100%; }
  `]
})
export class EncuestaAtencionComponent {
  surveyData = {
    comentario: '',
    estrellas: 0,
    resuelto: null,
    recomienda: false,
    tiempoEspera: 5
  };

  submitSurvey(): void {
    console.log('Encuesta Enviada:', this.surveyData);
    alert('¡Gracias por completar la encuesta! Simulando envío al servidor.');
  }
}
