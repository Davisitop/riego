import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string = 'Cerrar', duration: number = 3500, position: {horizontal?: 'left'|'center'|'right', vertical?: 'top'|'bottom'} = {}) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: position.horizontal || 'right',
      verticalPosition: position.vertical || 'top',
      panelClass: ['custom-snackbar']
    });
  }
}