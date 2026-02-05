import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfigDialogComponent } from './config-dialog.component';
import { NotificationService } from '../notification.service';
import { AboutComponent } from '../about/about.component';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, MatDialogModule, ConfigDialogComponent, AboutComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() selectedConfigId: string|null = null;
  @Output() selectedConfigChange = new EventEmitter<string>();
  @Input() configs: any[] = [];
  @Output() configSaved = new EventEmitter<any>();
  expandedConfigId: string|null = null;
  editingConfigId: string|null = null;
  editedConfig: any = null;

  constructor(public notification: NotificationService, public dialog: MatDialog, private firebase: FirebaseService) {}

  toggleConfig(id: string) {
    this.expandedConfigId = this.expandedConfigId === id ? null : id;
  }

  openCreateConfigDialog() {
    const dialogRef = this.dialog.open(ConfigDialogComponent, {
      width: '350px',
      data: { config: { plantType: '', name: '', humidityThreshold: null, temperatureThreshold: null } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.configSaved.emit(result);
      }
    });
  }

  openAboutModal() {
    this.dialog.open(AboutComponent, {
      width: '500px',
    });
  }

  async generateReport() {
    this.firebase.getSensorData().subscribe(data => {
      if (data) {
        const sensorData = data.casa;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Fecha,Temperatura,Humedad\n";
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        csvContent += `${formattedDate},${sensorData.temperatura},${sensorData.humedad_aire}\n`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reporte_sensores.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
        this.notification.show('Reporte generado exitosamente', 'Cerrar', 3500, {horizontal: 'right', vertical: 'bottom'});

      } else {
        this.notification.show('No hay datos para generar el reporte', 'Cerrar', 3500, {horizontal: 'right', vertical: 'bottom'});
      }
    });
  }

  onConfigSelect(id: string) {
    this.selectedConfigId = id;
    this.selectedConfigChange.emit(id);
  }

  editConfig(config: any, event: Event) {
    event.stopPropagation();
    this.editingConfigId = config._id;
    this.editedConfig = { ...config };
  }

  saveConfig(config: any, event: Event) {
    event.stopPropagation();
    if (this.editedConfig) {
      this.configSaved.emit({ ...this.editedConfig, _id: config._id });
      this.editingConfigId = null;
      this.editedConfig = null;
    }
  }

  deleteConfig(config: any, event: Event) {
    event.stopPropagation();
    if (confirm('¿Seguro que deseas eliminar esta configuración?')) {
      this.configSaved.emit({ ...config, _delete: true });
    }
  }
}
