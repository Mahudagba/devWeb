import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  userIsConnected:boolean = false;
constructor(
  private authService:AuthService
){}
  ngOnInit(){
    this.userIsConnected = this.authService.getUserIsConnected();
  }
}
