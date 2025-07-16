import { Component, EventEmitter, Output } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-new-users-modal',
  templateUrl: './add-new-users-modal.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./add-new-users-modal.component.scss']
})
export class AddNewUsersModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitData = new EventEmitter<any>();

  postForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    userId: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    body: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  onSubmit() {
    if (this.postForm.valid) {
      this.submitData.emit(this.postForm.value);
      this.postForm.reset();
      this.close.emit();
    }
  }

  onCancel() {
    this.close.emit();
  }
}
