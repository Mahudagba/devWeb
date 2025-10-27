import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { error } from 'console';
import e from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {
 cartItems: CartItem[] = [];

constructor(private cartService: CartService,private authService: AuthService,private router: Router) {

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
    this.authService.saveCommande(this.cartItems).subscribe({
      next: (response) => {
        alert('Commande Enregistrée avec succès !');
        // alert('Paiement en cours...');
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
    error: (error) => {
        console.error('Erreur lors de la commande');
        alert(`Erreur lors de la reservation de la commande. Veuillez réessayer. ${JSON.parse(error)}`, );
      }
    });
  }
}


