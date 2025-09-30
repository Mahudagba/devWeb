import { Component } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
//  cartItems: Product[] = [];
//   total: number = 0;

//   constructor(private cartService: CartService) {}

//   ngOnInit(): void {
//     // On s’abonne aux changements du panier
//     this.cartService.cartItems$.subscribe(items => {
//       this.cartItems = items;
//       this.total = this.cartService.getTotal();
//     });
//   }

//   removeItem(id: number) {
//     this.cartService.removeFromCart(id);
//   }

//   clearCart() {
//     this.cartService.clearCart();
//   }
}
