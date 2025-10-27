import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail {
  categories: any[] = [];
 product: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (data) => {
          this.product = data;
          this.loadCategories();
          this.loading = false;
          console.log("Produit chargé:", this.product);

        },
        error: (err) => {
          console.error(err);
          this.error = 'Erreur lors du chargement du produit';
          this.loading = false;
        },
      });
    }
  }



  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur de chargement des catégories', err)
    });
  }

  updateProduct(): void {
    if (!this.product) return;
    this.productService.updateProduct(this.product.id, this.product).subscribe({
      next: () => {
        alert('Produit mis à jour avec succès !');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour du produit.');
      },
    });
  }

  deleteProduct(): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          alert('Produit supprimé avec succès !');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la suppression du produit.');
        },
      });
    }
  }

    compareCategories(cat1: any, cat2: any): boolean {
  return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
}
}
