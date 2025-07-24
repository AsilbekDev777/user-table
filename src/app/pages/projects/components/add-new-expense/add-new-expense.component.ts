import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-add-new-expense',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './add-new-expense.component.html',
  styleUrl: './add-new-expense.component.scss'
})
export class AddNewExpenseComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitData = new EventEmitter<any>();
  onCancel() {
    this.close.emit();
  }
  expenseForm: FormGroup;
  categories = ['Groceries', 'Utilities', 'Transport', 'Entertainment'];
  paymentSources = ['Credit', 'Cash', 'Debit', 'Bank Transfer'];

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      name: ['', [Validators.required,Validators.minLength(4) ]],
      amount: ['', [Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01)]],
      date: ['', Validators.required],
      category: ['', Validators.required],
      paymentSource: ['', Validators.required],
      comments: ['']
    });
  }

  onSubmit() {
     if (this.expenseForm.invalid) {
        this.expenseForm.markAllAsTouched();
        return;
     } else if (this.expenseForm.valid) {
      this.submitData.emit({
        name: this.expenseForm.value.name,
        amount: this.expenseForm.value.amount,
        date: this.expenseForm.value.date,
        category: this.expenseForm.value.category,
        paymentType: this.expenseForm.value.paymentSource,
        comments: this.expenseForm.value.comments
      });
      this.expenseForm.reset();
      this.close.emit();
    }
  }

  onReset() {
    this.expenseForm.reset({
      name: '',
      amount: '',
      date: '',
      category: '',
      paymentSource: '',
      comments: ''
    });
  }
}
