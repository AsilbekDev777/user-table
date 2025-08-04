import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, CommonModule, DatePipe} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {AddNewExpenseComponent} from './components/add-new-expense/add-new-expense.component';
import {
  MatTableDataSource
} from '@angular/material/table';
import {DetailsComponent} from './components/details/details.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    MatPaginator,
    AsyncPipe,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private router: Router) {}
  transactions = [
    {
      id: this.generateId(),
      name: 'test',
      amount: 100,
      date: new Date('2025-07-21'),
      category: 'Groceries',
      paymentType: 'Credit',
      comments: 'This is a test comment',
      selected: false
    },
    {
      id: this.generateId(),
      name: 'testasdf',
      amount: 123,
      date: new Date('2025-07-27'),
      category: 'Groceries',
      paymentType: 'Credit',
      comments: 'This is a test comment',
      selected: false
    },
  ];

  generateId(): string {
    return crypto.randomUUID();
  }

  dataSource = new MatTableDataSource<any>(this.transactions);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const storedData = localStorage.getItem('transactions');
    if (storedData) {
      this.transactions = JSON.parse(storedData);
      this.dataSource.data = this.transactions;
    }
  }

  selectedCount = 0;

  // Barchasini belgilash / olib tashlash

  toggleAllSelection(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.transactions.forEach((item) => (item.selected = checked));
    this.updateSelectedCount();
  }

  // Barchasi tanlanganmi — thead ni avtomatik belgilash uchun
  isAllSelected(): boolean {
    return this.transactions.every((item) => item.selected);
  }

  // Nechtasi tanlanganligini hisoblash
  updateSelectedCount(): void {
    this.selectedCount = this.transactions.filter((item) => item.selected).length;
  }

// Add new expense degan modal
  readonly dialog = inject(MatDialog);

  openNewModal(): void {
    this.dialog.open(AddNewExpenseComponent).componentInstance.submitData.subscribe((info) => {
      info.id = this.generateId();
      this.transactions.push(info);
      this.dataSource.data = [...this.transactions];
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
    })
  }

  // Details degan modal uchun
  readonly detailsModal = inject(MatDialog);

  openDetail(element: any): void {
    this.detailsModal.open(DetailsComponent, {
      data: element
    })
  }

  //Delete row funksiyasi
  deleteRow(element: any) {
    if (!element.id) {
      console.warn('Elementda id yo‘q!');
      return;
    }
    // this.transactions ni filtrlash
    this.transactions = this.transactions.filter(item => item.id !== element.id);
    // localStorage'ni yangilash
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
    // jadvalni yangilash
    this.dataSource.data = [...this.transactions];
  }


  confirmDelete(element: any) {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      this.deleteRow(element);
    }
  }

  //Open Edit modal
  openEditModals(element: any): void {
    const dialogRef = this.dialog.open(AddNewExpenseComponent);
    dialogRef.componentInstance.expenseToEdit = { ...element };

    dialogRef.componentInstance.submitData.subscribe((info: any) => {
      if (info.id) {
        // ID bo‘lsa — edit rejim
        const index = this.transactions.findIndex(item => item.id === info.id);
        if (index !== -1) {
          this.transactions[index] = { ...info, selected: false };
        }
      }
      // Jadval va localStorage ni yangilaymiz
      this.dataSource.data = [...this.transactions];
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
    });
  }
  // Open Categories page
  openCategories(category:string){
    this.router.navigate(['projects/categories/', category]);
  }

}
