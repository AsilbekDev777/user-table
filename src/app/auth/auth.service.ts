// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_KEY = 'AIzaSyAdENYvQg1gI_1pONInILcbQNX_Ji4Bss8';
  private readonly SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private readonly LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
  private refreshKey = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) {}

  register(email: string, password: string) {
    return this.http.post(this.SIGNUP_URL, {
      email,
      password,
      returnSecureToken: true
    });
  }

  login(email: string, password: string) {
    return this.http.post(this.LOGIN_URL, {
      email,
      password,
      returnSecureToken: true
    });
  }

   refreshToken(): Observable<any> {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return throwError(() => new Error('No refresh token found'));
       const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', refreshToken);

      return this.http.post(
        `https://securetoken.googleapis.com/v1/token?key=AIzaSyAdENYvQg1gI_1pONInILcbQNX_Ji4Bss8`,
        body.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      ).pipe(
        tap((res: any) => {
          this.setToken(res.idToken);
          this.setRefreshToken(res.refresh_token);
        })
      )
    }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  setRefreshToken(refreshToken: string) {
    localStorage.setItem(this.refreshKey, refreshToken);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  async logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    await this.router.navigate(['/login']);
  }

  getUserProfile() {
    const idToken = this.getToken();
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.API_KEY}`;
    return this.http.post(url, { idToken });
  }
}
