
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ConfigDialogComponent } from './sidebar/config-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { AuthComponent } from './auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ConfigDialogComponent, DashboardComponent, FooterComponent, AuthComponent, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    get selectedConfig() {
      return this.configs.find((c: any) => c._id === this.selectedConfigId) || this.configs[0] || null;
    }
  title = 'eco-riego';
  sidebarOpen = true;
  selectedConfigId: string|null = null;
  authModal: 'signin' | 'register' | null = null;
  currentDate: Date = new Date();
  user: any = null;
  configs: any[] = [];

  constructor(private notification: NotificationService) {
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    this.currentDate = new Date();
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  openSidebar() {
    this.sidebarOpen = true;
  }

  openAuth(type: 'signin' | 'register') {
    this.authModal = type;
  }

  closeAuth() {
    this.authModal = null;
  }

  onAuthSuccess(event: any) {
    this.user = event.user;
    this.configs = event.configs;
    this.selectedConfigId = this.configs[0]?._id || null;
    this.closeAuth();
  }
  onSelectedConfigChange(id: string) {
    this.selectedConfigId = id;
  }

  async fetchUserConfigs() {
    if (!this.user?._id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/plantConfig?userId=${this.user._id}`);
      if (response.ok) {
        const configs = await response.json();
        console.log('DEBUG: fetchUserConfigs() nuevos configs:', configs);
        this.configs = [...configs]; // Forzar cambio de referencia para OnPush
        if (!this.selectedConfigId && configs.length) {
          this.selectedConfigId = configs[0]._id;
        } else if (this.selectedConfigId && !configs.find((c: any) => c._id === this.selectedConfigId)) {
          this.selectedConfigId = configs[0]?._id || null;
        }
        setTimeout(() => {
          console.log('DEBUG: this.configs después de asignar:', this.configs);
        }, 0);
      }
    } catch (err) {
      console.error('Error en fetchUserConfigs:', err);
    }
  }

  async onConfigSaved(config: any) {
    if (config._delete && config._id) {
      // Eliminar configuración
      try {
        const response = await fetch(`http://localhost:3000/api/plantConfig/${config._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await this.fetchUserConfigs();
          this.notification.show('¡Configuración eliminada!');
        } else {
          this.notification.show('Error al eliminar la configuración', 'Cerrar', 4000);
        }
      } catch (err) {
        this.notification.show('Error de red al eliminar la configuración', 'Cerrar', 4000);
      }
      return;
    }
    if (config._id) {
      // Editar configuración existente
      try {
        const response = await fetch(`http://localhost:3000/api/plantConfig/${config._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${this.user?.token}`
          },
          body: JSON.stringify(config)
        });
        if (response.ok) {
          await this.fetchUserConfigs();
          this.notification.show('¡Configuración actualizada exitosamente!');
        } else {
          this.notification.show('Error al guardar la configuración', 'Cerrar', 4000);
        }
      } catch (err) {
        this.notification.show('Error de red al guardar la configuración', 'Cerrar', 4000);
      }
    } else {
      // Crear nueva configuración
      try {
        console.log('DEBUG: this.user =', this.user);
        console.log('DEBUG: this.user?._id =', this.user?._id);
        const response = await fetch('http://localhost:3000/api/plantConfig', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${this.user?.token}`
          },
          body: JSON.stringify({
            ...config,
            userId: this.user?._id
          })
        });
        if (response.ok) {
          await this.fetchUserConfigs();
          this.notification.show('¡Configuración creada exitosamente!');
        } else {
          this.notification.show('Error al crear la configuración', 'Cerrar', 4000);
        }
      } catch (err) {
        this.notification.show('Error de red al crear la configuración', 'Cerrar', 4000);
      }
    }
  }
  logout() {
    this.user = null;
    this.configs = [];
    localStorage.removeItem('token');
  }
}
