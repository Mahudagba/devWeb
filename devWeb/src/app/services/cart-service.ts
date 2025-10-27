
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Observable pour écouter le panier en direct
  cartItems$ = this.cartItems.asObservable();

  private readonly STORAGE_KEY = 'cart_items';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
     if (isPlatformBrowser(this.platformId)) {
    // Charger le panier sauvegardé au démarrage
    const storedCart = sessionStorage.getItem(this.STORAGE_KEY);
    if (storedCart) {
      this.items = JSON.parse(storedCart);
      this.cartItems.next(this.items);
    }}
  }

  addToCart(product: Product) {
    let found:boolean =false;
    for (let index = 0; index < this.items.length; index++) {
      if(this.items[index].product.id == product.id){
        this.items[index].quantity +=1; 
        found = true;
      } 
    }
    if(!found){
      this.items.push({
        product:product,
        price:product.price,
        quantity:1
      });
    }
    
    this.cartItems.next(this.items);
     if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    }
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.cartItems.next(this.items);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    }
  }


  clearCart() {
    this.items = [];
    this.cartItems.next(this.items);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    }
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price*item.quantity, 0);
  }

}
