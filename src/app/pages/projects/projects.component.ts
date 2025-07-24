import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {AddNewExpenseComponent} from './components/add-new-expense/add-new-expense.component';
import {
  MatTableDataSource
} from '@angular/material/table';
import {DetailsComponent} from './components/details/details.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    MatPaginator,
    AddNewExpenseComponent,
    NgIf,
    AsyncPipe,
    DetailsComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
   transactions = [
    {
      name: 'test',
      amount: 100,
      date: new Date('2025-07-21'),
      category: 'Groceries',
      paymentType: 'Credit',
      comments:'This is a test comment',
      selected: false
    },
    {
      name: 'testasdf',
      amount: 123,
      date: new Date('2025-07-27'),
      category: 'Groceries',
      paymentType: 'Credit',
      comments:'This is a test comment',
      selected: false
    },
  ];

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
  handleSubmittedData(data: any) {
    const newItem = {
      ...data,
      details: data.comment,
      selected: false // har doim yangi item tanlanmagan bo'ladi
    };
    this.transactions.push(newItem);
    this.dataSource.data = [...this.transactions]; // table yangilanishi uchun spread
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
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



  showModal = false;
  addNewExpense(){
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  selectedExpense: any = null;
  showDetailsModal: boolean = false;

  openDetails(item: any) {
    this.selectedExpense = item;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
  }
}
