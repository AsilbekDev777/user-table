import {Component, Output, EventEmitter, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
  @Output() close = new EventEmitter<void>();

  readonly dialogRef = inject(MatDialogRef<DetailsComponent>);
  data = inject(MAT_DIALOG_DATA);

  onClose():void {
    this.dialogRef.close();
  }

}
