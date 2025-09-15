
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})

export class ProductCard {
  @Input() name!: string;
  @Input() price!: number;
  // @Input() currency!: string; 
  @Input() image!: string;// image principale
  
  @Output() addToCart = new EventEmitter<void>();
  @Output() addToFavorites = new EventEmitter<void>();

  onAddToCart() {
    this.addToCart.emit();
  }

  onAddToFavorites() {
    this.addToFavorites.emit();
  }
}
