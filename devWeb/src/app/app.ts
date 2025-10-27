import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('devWeb');
  constructor(private router: Router) {}

  ngOnInit(){
    
  }

  shouldShowFooter(): boolean {
    return !this.router.url.includes('admin');
  }
}
