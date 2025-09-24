import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/auth/login';

  constructor(){}

  login(username:string,password:string){
    return this.http.post(this.apiUrl,{
      username:username,
      password:password
    });
  }

  saveToken(token: string) {
    // const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    // document.cookie = `auth_token=${token}; path=/; expires=${expires}; SameSite=Strict`;
     localStorage.setItem('token', JSON.stringify(token));
  
   
  }

  getToken() {
    return JSON.parse(<string>localStorage.getItem('token'));
    // return document.cookie
    //   .split('; ')
    //   .find(cookie => cookie.startsWith('auth_token='))
    //   ?.split('=')[1] ?? null;
  }

  getUserIdFromToken(token: string) {
    return this.decodeJwt(token).sub;
  }

  decodeJwt(token: string): { sub: number, iat: number, user: string } {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  getUserIsConnected(){
    const decoded = this.decodeJwt(this.getToken()??'');

      if (!decoded?.iat) return false; // pas d'iat → considéré invalide

      const issuedAt = decoded.iat * 1000; // conversion en ms
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms
      const now = Date.now();

      if(now - issuedAt > oneWeek){
        return false;
      }
      return true;
  }
}
