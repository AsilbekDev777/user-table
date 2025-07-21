import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });


  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    const email = this.form.value.username!;
    const password = this.form.value.password!;

    this.auth.register(email, password).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.idToken);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Ro’yxatdan o’tib bo‘lingan. Login sahifaga o‘ting.');
        this.router.navigate(['/login']);
      }
    });
  }
}
