import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';          // Interface ou classe utilisateur
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit {
  user: any | null = null;

  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser().subscribe({
      next:(user:any) =>{
       
        this.user =user;
        console.log('User recupérer: ', this.user);
      },
      error:(error:any) =>{
        console.error('Erreur lors de la recuperation des informations utilisateur' ,error);
      }
    });
  }

  goToEditProfile(): void {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['/admin/edit-profile']);
    } else {
      this.router.navigate(['/edit-profile']);
    }
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  deleteAccount(): void {
    
    this.router.navigate(['/delete-account']);
  }


  shouldShowButton(): boolean {
    return !this.router.url.includes('admin');
  }

    
}



