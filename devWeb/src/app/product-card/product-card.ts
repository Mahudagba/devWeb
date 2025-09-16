
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})

export class ProductCard {
  @Input() product!: Product;
  
  
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToFavorites = new EventEmitter<Product>();

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onAddToFavorites() {
    this.addToFavorites.emit(this.product);
  }
}


