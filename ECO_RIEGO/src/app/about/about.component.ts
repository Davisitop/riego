import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  constructor(public dialogRef: MatDialogRef<AboutComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
