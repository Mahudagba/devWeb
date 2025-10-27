import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layaout',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layaout.html',
  styleUrl: './admin-layaout.scss'
})
export class AdminLayaout {
constructor(
   
    private router: Router
  ) { }
}


