import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Observable pour écouter le panier en direct
  cartItems$ = this.cartItems.asObservable();

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
        quantity:1
      });
    }
    
    this.cartItems.next(this.items);
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.cartItems.next(this.items);
  }


  clearCart() {
    this.items = [];
    this.cartItems.next(this.items);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price*item.quantity, 0);
  }
}
