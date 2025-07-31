import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable, tap, throwError, switchMap, of, catchError} from 'rxjs';

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
    }).pipe(
      tap((res: any) => {
        this.setToken(res.idToken);
        this.setRefreshToken(res.refreshToken);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post(this.LOGIN_URL, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      tap((res: any) => {
        this.setToken(res.idToken);
        this.setRefreshToken(res.refreshToken);
      })
    );
  }

  refreshToken(): Observable<any> {
  const refreshToken = this.getRefreshToken();
  if (!refreshToken) return throwError(() => new Error('No refresh token found'));

  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);

  return this.http.post(
    `https://securetoken.googleapis.com/v1/token?key=${this.API_KEY}`,
    body.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  ).pipe(
    tap((res: any) => {
      const newIdToken = res['id_token'];
      const newRefreshToken = res['refresh_token'];
      if (newIdToken) this.setToken(newIdToken);
      if (newRefreshToken) this.setRefreshToken(newRefreshToken);
    })
  );
}

authFetch<T>(cb: (token: string) => Observable<T>): Observable<T> {
  const token = this.getToken();
  if (!token) return throwError(() => new Error('No token found'));

  return cb(token).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403 || error.status === 400) {
        // Token eskirgan bo'lishi mumkin — yangilaymiz
        return this.refreshToken().pipe(
          switchMap((res: any) => {
            const newToken = res['id_token']; // ⚠️ pastki chiziq
            if (!newToken) return throwError(() => new Error('No new token returned from refresh'));
            this.setToken(newToken); // yangi tokenni saqlaymiz
            return cb(newToken); // qayta chaqiramiz
          })
        );
      }
      return throwError(() => error);
    })
  );
}

  getUserProfile(): Observable<any> {
    return this.authFetch<any>((token) => {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.API_KEY}`;
      return this.http.post(url, { idToken: token });
    });
  }

  logout(): Promise<boolean> {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.refreshKey);
    return this.router.navigate(['/login']);
  }

  // Token helpers
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
}
