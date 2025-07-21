// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_KEY = 'AIzaSyAdENYvQg1gI_1pONInILcbQNX_Ji4Bss8';
  private readonly SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private readonly LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;

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

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getUserProfile() {
    const idToken = this.getToken();
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.API_KEY}`;
    return this.http.post(url, { idToken });
  }
}
