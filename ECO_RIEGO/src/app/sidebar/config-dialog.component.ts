import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Nueva configuración</h2>
    <form (ngSubmit)="save()" class="flex flex-col gap-2 p-2">
      <label>Tipo de planta:</label>
      <select class="border rounded px-2 py-1" [(ngModel)]="data.config.plantType" name="plantType" required (change)="onPlantTypeChange($event)">
        <option value="" disabled selected>Selecciona un tipo</option>
        <option *ngFor="let type of plantTypes" [value]="type">{{ type }}</option>
      </select>
      <div *ngIf="showSuggestion" class="flex items-center text-blue-600 text-sm mt-1 mb-2">
        <span class="material-icons mr-1" style="font-size:18px;">info</span>
        Sugerencia aplicada según el tipo de planta
      </div>
      <label>Nombre de la planta:</label>
      <input class="border rounded px-2 py-1" [(ngModel)]="data.config.name" name="name" required />
      <label>Humedad mínima (%):</label>
      <input class="border rounded px-2 py-1" type="number" [(ngModel)]="data.config.humidityThreshold" name="humidity" required />
      <label>Temperatura mínima (°C):</label>
      <input class="border rounded px-2 py-1" type="number" [(ngModel)]="data.config.temperatureThreshold" name="temperature" required />
      <div class="flex gap-2 mt-4">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
        <button type="button" class="bg-gray-300 px-4 py-2 rounded" (click)="close()">Cancelar</button>
      </div>
    </form>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  `
})
export class ConfigDialogComponent {

  plantTypes = [
    'Tomate',
    'Lechuga',
    'Albahaca',
    'Cilantro',
    'Perejil',
    'Espinaca',
    'Fresa',
    'Pimiento',
    'Otro'
  ];

  plantSuggestions: Record<string, {humidity: number, temperature: number}> = {
    'Tomate': { humidity: 65, temperature: 22 },
    'Lechuga': { humidity: 70, temperature: 18 },
    'Albahaca': { humidity: 65, temperature: 23 },
    'Cilantro': { humidity: 65, temperature: 18 },
    'Perejil': { humidity: 65, temperature: 18 },
    'Espinaca': { humidity: 75, temperature: 15 },
    'Fresa': { humidity: 75, temperature: 18 },
    'Pimiento': { humidity: 65, temperature: 23 },
  };

  showSuggestion = false;


  constructor(
    public dialogRef: MatDialogRef<ConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onPlantTypeChange(event: any) {
    const type = event.target.value;
    if (this.plantSuggestions[type]) {
      this.data.config.humidityThreshold = this.plantSuggestions[type].humidity;
      this.data.config.temperatureThreshold = this.plantSuggestions[type].temperature;
      this.showSuggestion = true;
    } else {
      this.showSuggestion = false;
    }
  }

  save() {
    if (this.data.config.plantType && this.data.config.name && this.data.config.humidityThreshold != null && this.data.config.temperatureThreshold != null) {
      this.dialogRef.close(this.data.config);
    }
  }
  close() {
    this.dialogRef.close();
  }
}