import {Component, inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {UserSelectModalComponent} from './components/header-search-modal/header-search-modal.component';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

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
  userEmail: string = 'Loading...';
  showModal = false;
  selectedUserId: number | null = null;
  auth = inject(AuthService);
  router = inject(Router);

   ngOnInit() {
    this.auth.getUserProfile().subscribe({
      next: (res: any) => {
        this.userEmail = res.users[0]?.email || 'No email';
      },
      error: () => {
        this.userEmail = 'Unknown';
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  handleSelectUserId(userId: number) {
    this.selectedUserId = userId;
  }
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.auth.logout();
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
