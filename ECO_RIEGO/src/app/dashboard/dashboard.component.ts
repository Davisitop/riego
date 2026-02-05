import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GaugeComponent } from '../gauge/gauge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, GaugeComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FirebaseService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() config: any = null;
  humedad: number = 0;
  temperatura: number = 0;
  estadoPrograma: boolean = true;
  estadoMensaje: string = '';
  ilustracion: string = '';
  intervalId: any;

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.leerDatos();
    this.intervalId = setInterval(() => this.leerDatos(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  async leerDatos() {
    const data = await this.firebase.getSensorData();
    if (data && data.casa) {
      this.humedad = data.casa.humedad_aire ?? 0;
      this.temperatura = data.casa.temperatura ?? 0;
      this.compararConConfig();
    } else {
      this.humedad = 0;
      this.temperatura = 0;
    }
  }

  compararConConfig() {
    if (!this.config) {
      this.estadoMensaje = 'Selecciona una configuración.';
      this.ilustracion = '🌱';
      return;
    }
    if (this.humedad < this.config.humidityThreshold) {
      this.estadoMensaje = '¡Humedad baja!';
      this.ilustracion = '😵';
    } else if (this.temperatura < this.config.temperatureThreshold) {
      this.estadoMensaje = '¡Temperatura baja!';
      this.ilustracion = '🥶';
    } else {
      this.estadoMensaje = 'Parámetros óptimos';
      this.ilustracion = '😊';
    }
  }
}
