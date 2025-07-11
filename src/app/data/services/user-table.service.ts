import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserInterface} from '../interfaces/user-table.interface';

@Injectable({
  providedIn: 'root'
})
export class UserTableService {
  http = inject(HttpClient);
  baseApiUrl = 'https://jsonplaceholder.typicode.com';

  getPost(){
    return this.http.get<UserInterface[]>(`${this.baseApiUrl}/posts`)
  }
  addData(param:any){
    return this.http.post<UserInterface[]>(`${this.baseApiUrl}/posts`, param)
  }
}
