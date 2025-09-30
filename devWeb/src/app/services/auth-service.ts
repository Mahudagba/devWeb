import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/';

  currentUserSubject = new BehaviorSubject<{} | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // ⚡ au démarrage → recharger si un token existe déjà
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.saveToken(token);
      }
    }

  }

  /** Observable public de l’état utilisateur */
  get currentUser$(): Observable<{} | null> {
    return this.currentUserSubject.asObservable();
  }

  register(data: {}) {
    return this.http.post(this.apiUrl+'users', data);
  }

  login(username: string, password: string) {
    return this.http.post(this.apiUrl +'auth/login', {
      username: username,
      password: password,
    });
  }

  saveToken(token: string) {
    // const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    // document.cookie = `auth_token=${token}; path=/; expires=${expires}; SameSite=Strict`;
    if (isPlatformBrowser(this.platformId)) {
      if (!localStorage) return;

      localStorage.setItem('token', JSON.stringify(token));
      this.currentUserSubject.next(this.decodeJwt(token));
    }
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      if (!localStorage) return null;
      return JSON.parse(<string>localStorage.getItem('token'));
    }
    // return document.cookie
    //   .split('; ')
    //   .find(cookie => cookie.startsWith('auth_token='))
    //   ?.split('=')[1] ?? null;
  }

  /** Déconnexion */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log("execution de la gogic log out");
      localStorage.removeItem('token');
      this.currentUserSubject.next(null);
    }
    console.log("user is now connceted?", this.isUserConnected());
  }

  /** Vérifie si l’utilisateur est connecté */
  isUserConnected(): boolean {
    return this.currentUserSubject.value !== null;
  }

  decodeJwt(token: string): { sub: number, iat: number, user: string } {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

}
