import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categoryName:string = '';
  filteredTransactions:any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.categoryName = this.route.snapshot.paramMap.get('id') || '';
    const storedData = localStorage.getItem('transactions');

    if (storedData) {
      const transactions = JSON.parse(storedData);
      this.filteredTransactions = transactions.filter((t:any) =>
        t.category === this.categoryName
      );
    }
  }
}
