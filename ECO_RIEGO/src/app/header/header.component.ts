import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() user: any = null;
  @Output() signIn = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  openSignIn() {
    this.signIn.emit();
  }

  openRegister() {
    this.register.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
