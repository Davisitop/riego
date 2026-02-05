import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  @Input() isSignIn: boolean = true;
  @Output() close = new EventEmitter<void>();
  @Output() authSuccess = new EventEmitter<any>();

  form!: FormGroup;
  error = '';

  constructor(private authService: AuthService, private notification: NotificationService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
      ]),
      username: new FormControl('')
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  toggleMode() {
    this.isSignIn = !this.isSignIn;
    this.error = '';
    this.form.reset();
  }

  closeModal() {
    this.close.emit();
  }

  submit() {
    if (this.form.invalid) {
      this.error = 'Por favor, corrige los errores en el formulario.';
      return;
    }

    this.error = '';
    const { email, password, username } = this.form.value;

    if (this.isSignIn) {
      this.authService.login({ email, password }).subscribe({
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
      this.authService.register({ username, email, password }).subscribe({
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
