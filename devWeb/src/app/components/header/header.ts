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

  userAvatarUrl: string | null = null;
  userName: string | null = null;

  private router: Router = inject(Router)
  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) { }
  ngOnInit() {

    const user = this.authService.getCurrentUserSavedInfo();
    if (user) {

      // this.userAvatarUrl = user.avatarUrl;
      this.userName = user.name;
    }

  }


  get userIsConnected(): boolean {
    return this.authService.currentUserSubject.value != null;
  }

  navigateHome() {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  navigateToProfile() {
    
    if (this.router.url.includes('admin')) {
      this.router.navigate(['/admin/profile']);
    } else {
      this.router.navigate(['/profile']);
    }
  }


  logout() {
    console.log(" logout cliqued");
    this.cartService.clearCart();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
