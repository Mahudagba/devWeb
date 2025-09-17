
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})

export class ProductCard {
  @Input() product!: Product;
  
  
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToFavorites = new EventEmitter<Product>();

    // Pour afficher une description courte dans la carte
  shortDescription(max = 120) {
    if (!this.product?.description) return '';
    return this.product.description.length > max
      ? this.product.description.slice(0, max).trim() + '…'
      : this.product.description;
  }


  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onAddToFavorites() {
    this.addToFavorites.emit(this.product);
  }

  onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/images/placeholder.png';
}
}


