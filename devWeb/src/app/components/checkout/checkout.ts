import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {
@Input() cartItems: CartItem[] = [];

  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  onPay() {
    // Ici tu mettras la logique pour intégrer un service de paiement (Stripe, PayPal, etc.)
    alert('Paiement en cours...');
  }
}


