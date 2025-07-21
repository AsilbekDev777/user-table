import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    const email = this.form.value.email!;
    const password = this.form.value.password!;

    this.auth.login(email, password).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.idToken);
        this.router.navigate(['']);
      },
      error: () => alert('Login failed. Please check your credentials.')
    });
  }

}
