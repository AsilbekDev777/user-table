import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MatDialogRef} from '@angular/material/dialog';

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
export class AddNewExpenseComponent implements OnInit {
  @Input() expenseToEdit: any | null = null; // null bo‘lsa → Add rejim, object bo‘lsa → Edit rejim
  @Output() close = new EventEmitter<void>();
  @Output() submitData = new EventEmitter<any>();
  onCancel() {
    this.close.emit();
  }
  expenseForm: FormGroup;
  categories = ['Groceries', 'Utilities', 'Transport', 'Entertainment'];
  paymentSources = ['Credit', 'Cash', 'Debit', 'Bank Transfer'];
  modalTitle: string = 'Add Expense'; // default nomi

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
  ngOnInit() {
    if (this.expenseToEdit) {
      this.modalTitle = 'Edit Expense';
      this.expenseForm.patchValue({
        name: this.expenseToEdit.name,
        amount: this.expenseToEdit.amount,
        date: this.expenseToEdit.date,
        category: this.expenseToEdit.category,
        paymentSource: this.expenseToEdit.paymentType,
        comments: this.expenseToEdit.comments
      });
    }
  }

  onSubmit() {
     if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }
     interface Expense {
        id?: string;
        name: string;
        amount: number;
        date: string;
        category: string;
        paymentType: string;
        comments?: string;
     }

    const result: Expense = {
      name: this.expenseForm.value.name,
      amount: this.expenseForm.value.amount,
      date: this.expenseForm.value.date,
      category: this.expenseForm.value.category,
      paymentType: this.expenseForm.value.paymentSource,
      comments: this.expenseForm.value.comments
    };

    if (this.expenseToEdit) {
      result.id = this.expenseToEdit.id;
    }

    this.submitData.emit(result);
    this.expenseForm.reset();
    this.close.emit();
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
  readonly dialogRef = inject(MatDialogRef<AddNewExpenseComponent>);
   onNoClick(): void {
    this.dialogRef.close();
  }
}
