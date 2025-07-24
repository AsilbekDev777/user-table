import { Component, Input, Output, EventEmitter } from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  standalone: true,
  imports: [
    DatePipe
  ],
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  @Input() expense: any;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
