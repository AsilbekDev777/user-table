import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserTableService } from '../../data/services/user-table.service';
import { UserInterface } from '../../data/interfaces/user-table.interface';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {SvgIconComponent} from '../../components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [
    MatPaginator,
    MatColumnDef,
    MatHeaderCell,
    MatTable,
    NgIf,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatButton,
    SvgIconComponent,
    NgForOf,
    AsyncPipe,
    // boshqa material komponentlar...
  ],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements AfterViewInit {
  userTableService = inject(UserTableService);
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<UserInterface>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.userTableService.getPost().subscribe(user => {
      this.dataSource.data = user;
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  addNewData(){
    this.userTableService.addData({}).subscribe(newUsers => {
      this.dataSource.data = newUsers;
      console.log(newUsers);
    })
  }
}
