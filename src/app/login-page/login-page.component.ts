import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {NgIf} from '@angular/common';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent  implements HttpInterceptor{
  form = new FormGroup({
    email: new FormControl('', [Validators.required , Validators.email] ),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
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


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          // 401 bo‘lsa, refresh qilib qaytadan tokeni yangilaymiz
          if (error.status === 401) {
            return this.auth.refreshToken().pipe(
              switchMap(() => {
                const newToken = this.auth.getToken();
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                return next.handle(retryReq);
              }),
              catchError(() => {
                this.auth.logout(); // tokenni tozalab, login sahifaga qaytaramiz
                return throwError(() => new Error('Session expired'));
              })
            );
          }

          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }

}
