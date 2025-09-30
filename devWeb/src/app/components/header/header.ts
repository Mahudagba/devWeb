import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Cart } from '../cart/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule,Cart],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private router:Router = inject(Router)
constructor(
  private authService:AuthService
){}
  ngOnInit(){

  }

    // Getter pour accéder au titre
  get userIsConnected(): boolean {
    return this.authService.currentUserSubject.value!=null;
  }


  logout(){
    console.log(" logout cliqued");
    this.authService.logout();
  }
}
