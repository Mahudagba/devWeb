import { Component } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';
import { CommonModule } from '@angular/common';
import { ProductForm } from '../product-form/product-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule,ProductForm],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss'
})
export class AdminProductsList {
  products: Product[] = [];
  selectedProduct: Product | null = null;
    loading = true;
  error: string | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProductsAdmin().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
      },
    });
  }

  onEdit(product: Product) {
    this.selectedProduct = product;
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
  onDetail(product: Product) {
    // this.selectedProduct = product;
    this.router.navigate(['/admin/products', product.id]);
  }
  initializeNewProduct(){
    this.selectedProduct = <Product>{} 
  }

}
