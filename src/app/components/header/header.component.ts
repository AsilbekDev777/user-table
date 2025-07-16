import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {UserSelectModalComponent} from './components/header-search-modal/header-search-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    UserSelectModalComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showModal = false;
  selectedUserId: number | null = null;
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  handleSelectUserId(userId: number) {
    this.selectedUserId = userId;
  }
}
