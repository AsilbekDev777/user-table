import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserTableService } from '../../data/services/user-table.service';
import { UserInterface } from '../../data/interfaces/user-table.interface';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-people',
  standalone: true,
  imports: [
    MatPaginator,
    NgForOf,
    AsyncPipe,

  ],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements AfterViewInit {
  userTableService = inject(UserTableService);
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

  getTotalCount():number {
    return this.dataSource?.data?.length ?? 0;
  }

  exportToExcel(): void {
  const dataToExport = this.dataSource.data;

  if (!dataToExport || dataToExport.length === 0) {
    console.warn('No data to export');
    return;
  }
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(data, 'exported_data.xlsx');
}

}
