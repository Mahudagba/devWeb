import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { ProductsList } from './products-list/products-list';
import { Product } from './models/product.model';
import { ProductCard } from './product-card/product-card';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, ProductsList, ProductCard],
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
 product: Product = {
  id:145,
  name: 'Nike Air Max',
  price: 129.99,
  image: 'assets/nike.jpg'
};

products: Product[] = [
    { id:145, name: 'Nike Air Max', price: 129.99, image: 'assets/nike.jpg' },
    { id:146, name: 'Adidas Superstar', price: 99.99, image: 'assets/adidas.jpg' },
    { id:125, name: 'Puma RS-X', price: 109.99, image: 'assets/puma.jpg' },
    { id:143, name: 'New Balance 574', price: 119.99, image: 'assets/nb.jpg' }
  ];

}
