import { Component, Input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, ProductCard],
  standalone: true,
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss'
})
export class ProductsList {
  constructor(private productService:ProductService){

  }
 products: Product[] = [];

  onAddToCart(product: Product) {
    console.log(`Produit ajouté au panier: ${product.title}`);
  }

  onAddToFavorites(product: Product) {
    console.log(`Produit ajouté aux favoris: ${product.title}`);
  }

  ngOnInit(){
    this.productService.getProducts().subscribe({
      next:( products) =>{
        console.log('Produit recupérer: ', products);
        this.products =products;
      },
      error:(error) =>{
        console.error('Erreur lors de la recuperation des produits');
      }
    })
  }
}

