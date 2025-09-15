import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { ProductCard } from './product-card/product-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header,ProductCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('devWeb');

  onAddToCart() {
  console.log("Produit ajouté au panier !");
}

onAddToFavorites() {
  console.log("Produit ajouté aux favoris !");
}

}
