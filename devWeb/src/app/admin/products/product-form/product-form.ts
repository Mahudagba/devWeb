import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {
  categories: Category[] = [];
  @Input() product: Product = {
    name: '', price: 0, stock: 0, categories: [],
    id: 0,
    slug: '',
    image: '',
    is_active: false,
    description: ''
  };
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private productService: ProductService, private categoryService: CategoryService) { }
    ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur de chargement des catégories', err)
    });
  }

  saveProduct() {
    if (this.product.id) {
      this.productService.updateProduct(this.product.id, this.product).subscribe(() => this.saved.emit());
    } else {
      this.productService.createProduct(this.product).subscribe(() => this.saved.emit());
    }
  }
  compareCategories(cat1: any, cat2: any): boolean {
  return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
}
}


