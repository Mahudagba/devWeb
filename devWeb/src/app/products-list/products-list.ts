import { Component, Input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products-list',
  imports: [ProductCard],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss'
})
export class ProductsList {
@Input() products: ProductCard[] = [];

  onAddToCart(product: ProductCard) {
    // console.log(`Produit ajouté au panier: ${product.name}`);
  }

  onAddToFavorites(product: ProductCard) {
    // console.log(`Produit ajouté aux favoris: ${product.name}`);
  }
}

