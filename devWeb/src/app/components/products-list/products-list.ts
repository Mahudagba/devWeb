import { Component } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-service';
import { Cart } from '../cart/cart';
import { ProductSearch } from '../product-search/product-search';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, ProductCard,Cart, ProductSearch],
  standalone: true,
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss'
})
export class ProductsList {
  constructor(
    private productService:ProductService,

  ){

  }
 products: Product[] = [];

 filteredProducts: any[] = [];

  onSearchChangeLocal(query: string) {
    this.filteredProducts = this.products.filter((product) =>
      `${product.name} ${product.categories.map(c => c.name).join(' ')} ${product.description}`.toLowerCase().includes(query.toLowerCase())
    );
  }

   onSearchChangeRemote(query: string) {
    if(!query || query.trim() === '' || query.length < 3){
      this.filteredProducts = this.products;
      return;
    }
   this.productService.searchProducts(query).subscribe({next:(data) => {
    this.filteredProducts = data;
  }, error:(error) => {
    console.error('Erreur lors de la recherche des produits', error);
  }});
  }


  onAddToCart(product: Product) {
    console.log(`Produit ajouté au panier: ${product.name}`);
  }

  onAddToFavorites(product: Product) {
    console.log(`Produit ajouté aux favoris: ${product.name}`);
  }

  ngOnInit(){
    this.productService.getProducts().subscribe({
      next:( products) =>{
         console.log('Produit recupérer: ');
        this.products =products;
        this.filteredProducts = products;
      },
      error:(error) =>{
        console.error('Erreur lors de la recuperation des produits' ,error);
      }
    })
  }
}

