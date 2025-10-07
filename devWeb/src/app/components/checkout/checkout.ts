import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {
 cartItems: CartItem[] = [];

constructor(private cartService: CartService,){

}

ngOnInit(): void {
    // On s’abonne aux changements du panier
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      
    });
  }


  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  onPay() {
    // Ici tu mettras la logique pour intégrer un service de paiement (Stripe, PayPal, etc.)
    alert('Paiement en cours...');
  }
}


