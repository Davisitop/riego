import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfigDialogComponent } from './config-dialog.component';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, MatDialogModule, ConfigDialogComponent],
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

  constructor(public notification: NotificationService, public dialog: MatDialog) {}

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
