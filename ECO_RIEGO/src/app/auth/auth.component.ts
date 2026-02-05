import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  @Input() isSignIn: boolean = true;
  @Output() close = new EventEmitter<void>();
  @Output() authSuccess = new EventEmitter<any>();

  email = '';
  password = '';
  username = '';
  error = '';

  constructor(private authService: AuthService, private notification: NotificationService) {}

  toggleMode() {
    this.isSignIn = !this.isSignIn;
    this.error = '';
  }

  closeModal() {
    this.close.emit();
  }

  submit() {
    this.error = '';
    if (this.isSignIn) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.notification.show('¡Inicio de sesión exitoso!', 'Cerrar', 3500, {horizontal: 'right', vertical: 'bottom'});
          this.authSuccess.emit(res);
          this.closeModal();
        },
        error: (err) => {
          this.error = err.error.message || 'Error al iniciar sesión.';
        }
      });
    } else {
      this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
        next: () => {
          this.notification.show('¡Registro exitoso! Ahora puedes iniciar sesión.', 'Cerrar', 3500, {horizontal: 'right', vertical: 'bottom'});
          this.toggleMode();
        },
        error: (err) => {
          this.error = err.error.message || 'Error al registrarse.';
        }
      });
    }
  }
}
