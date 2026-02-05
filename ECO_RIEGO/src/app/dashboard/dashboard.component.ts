import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GaugeComponent } from '../gauge/gauge.component';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, GaugeComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FirebaseService]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() config: any = null;
  humedad: number = 0;
  temperatura: number = 0;
  estadoPrograma: boolean = true;
  estadoMensaje: string = '';
  ilustracion: string = '';
  intervalId: any;

  private chart: any;
  private sensorHistory: { time: Date, temp: number, hum: number }[] = [];

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.leerDatos();
    this.intervalId = setInterval(() => this.leerDatos(), 5000); // Actualizar cada 5 segundos
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  ngAfterViewInit() {
    this.initChart();
  }

  async leerDatos() {
    const data = await this.firebase.getSensorData();
    if (data && data.casa) {
      this.humedad = data.casa.humedad_aire ?? 0;
      this.temperatura = data.casa.temperatura ?? 0;

      const now = new Date();
      this.sensorHistory.push({ time: now, temp: this.temperatura, hum: this.humedad });
      if (this.sensorHistory.length > 20) { // Mantener solo los últimos 20 puntos
        this.sensorHistory.shift();
      }
      this.updateChart();

      this.compararConConfig();
    } else {
      this.humedad = 0;
      this.temperatura = 0;
    }
  }

  initChart() {
    const ctx = document.getElementById('sensorChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: [],
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y-axis-temp'
            },
            {
              label: 'Humedad (%)',
              data: [],
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              yAxisID: 'y-axis-hum'
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute'
              }
            },
            'y-axis-temp': {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Temperatura (°C)'
              }
            },
            'y-axis-hum': {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Humedad (%)'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }
  }

  updateChart() {
    if (!this.chart) return;

    this.chart.data.labels = this.sensorHistory.map(d => d.time);
    this.chart.data.datasets[0].data = this.sensorHistory.map(d => d.temp);
    this.chart.data.datasets[1].data = this.sensorHistory.map(d => d.hum);
    this.chart.update();
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
