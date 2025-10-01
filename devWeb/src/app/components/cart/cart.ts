import { Component, inject } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }
  private router: Router = inject(Router);

  ngOnInit(): void {
    // On s’abonne aux changements du panier
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  get userIsConnected(): boolean {
    return this.authService.currentUserSubject.value != null;
  }

  checkout() {
    if (this.userIsConnected) {
      console.log("Redirection vers la page de paiement...");

      this.router.navigate(['/checkout']);
    }
    else {
      console.log("Redirection vers la page de login...");
      this.router.navigate(['/login']);
    }

  }


}
