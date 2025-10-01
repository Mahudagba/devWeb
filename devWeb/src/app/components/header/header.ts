import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private router:Router = inject(Router)
constructor(
  private authService:AuthService,
  private cartService:CartService
){}
  ngOnInit(){

  }

    
  get userIsConnected(): boolean {
    return this.authService.currentUserSubject.value!=null;
  }


  logout(){
    console.log(" logout cliqued");
    this.cartService.clearCart();
    this.authService.logout();
  }
}
