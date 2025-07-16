import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserTableService} from '../../../../data/services/user-table.service';
import { UserInterface} from '../../../../data/interfaces/user-table.interface';

@Component({
  standalone: true,
  selector: 'app-user-select-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './header-search-modal.component.html',
  styleUrl: './header-search-modal.component.scss'
})
export class UserSelectModalComponent {
  private userService = inject(UserTableService);

  @Output() close = new EventEmitter<void>();
  @Output() selectUserId = new EventEmitter<number>();

  allUsers: UserInterface[] = [];
  filteredUsers: UserInterface[] = [];
  searchQuery = '';
  loading = true;

  ngOnInit() {
    this.userService.getPost().subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = users;
      this.loading = false;
    });
  }

  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.allUsers.filter(u =>
      u.id.toString().includes(query) || u.title.toLowerCase().includes(query)
    );
  }

  selectUser(userId: number) {
    this.selectUserId.emit(userId);
    this.close.emit();
  }
}
