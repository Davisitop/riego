import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent {
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() unit: string = '';
  @Input() color: string = '#4caf50';
  Math = Math;
  radius = 56;

  get circumference() {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset() {
    return this.circumference * (1 - this.value / 100);
  }
}
