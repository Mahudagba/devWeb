import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  cancelOrder(id: number) {
    //http://127.0.0.1:8000/api/orders/{id}/cancel
    return this.http.post(this.apiUrl + `orders/${id}/cancel`, {});
  }
    saveCommande(cartItems: CartItem[]) {
      
       const data = [...cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.price
       }))];
       
       return this.http.post(this.apiUrl + 'checkout', {items:data});
    }


  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/';

  currentUserSubject = new BehaviorSubject<{token: string, user: any} | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    //au démarrage → recharger si un token existe déjà
    if (isPlatformBrowser(this.platformId)) {
      // sessionStorage.removeItem('user');
      // sessionStorage.removeItem('token');
      const token = sessionStorage.getItem('token');
      const user = sessionStorage.getItem('user');
      console.log("AuthService initialized - checking for existing token: ", token, "and user: ", user);
      if (token && user) {
        this.currentUserSubject.next({ token: JSON.parse(token), user: JSON.parse(user) });
      }
    }

  }

  /** Observable public de l’état utilisateur */
  get currentUser$(): Observable<{} | null> {
    return this.currentUserSubject.asObservable();
  }

  register(data: {}) {
    return this.http.post(this.apiUrl + 'auth/register', data);
  }

  updateProfile(data: {}) {
    return this.http.put(this.apiUrl + 'auth/update/profile', data);
  }

  getCurrentUser(): any {
    return this.http.get(this.apiUrl + 'auth/me',);
  }

  getCurrentUserSavedInfo(): any {
    return this.currentUserSubject.value?.user || null;
  }

  login(email: string, password: string) {
    return this.http.post(this.apiUrl + 'auth/login', {
      email: email,
      password: password,
    });
  }

  saveUserInfo(userInfo: { token: string, user: any }) {
    // const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    // document.cookie = `auth_token=${token}; path=/; expires=${expires}; SameSite=Strict`;
    if (isPlatformBrowser(this.platformId)) {
      if (!sessionStorage) return;

      sessionStorage.setItem('token', JSON.stringify(userInfo.token));
      sessionStorage.setItem('user', JSON.stringify(userInfo.user));
      this.currentUserSubject.next(userInfo);
    }
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      if (!sessionStorage) return null;
      return JSON.parse(<string>sessionStorage.getItem('token'));
    }
    // return document.cookie
    //   .split('; ')
    //   .find(cookie => cookie.startsWith('auth_token='))
    //   ?.split('=')[1] ?? null;
  }

  /** Déconnexion */
  logout(remote: boolean = true): void {
    if (remote) {
      this.http.delete(this.apiUrl + 'auth/logout', {}).subscribe({
        next: (result) => {
          if (isPlatformBrowser(this.platformId)) {
            console.log("execution de la logique log out");
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('cart_items');
            this.currentUserSubject.next(null);
            console.log("user is now connected?", this.isUserConnected());
          }
          return result;
        },
        error: (err) => {
          console.error("Erreur lors de la déconnexion :", err);
          return err;
        }
      });
    }
    else {
      if (isPlatformBrowser(this.platformId)) {
        console.log("execution de la logique log out");
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        this.currentUserSubject.next(null);
        console.log("user is now connected?", this.isUserConnected());
      }
    }
  }


  getUserOrders() {
    return this.http.get(this.apiUrl + 'orders');
  }

  /** Vérifie si l’utilisateur est connecté */
  isUserConnected(): boolean {
    return this.currentUserSubject.value !== null;
  }

}
