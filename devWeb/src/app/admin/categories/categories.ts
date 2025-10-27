

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories implements OnInit {
  categories: any[] = [];
  newCategory = { name: '' };
  editingCategory: any = null;
  loading = true;
  error: string | null = null;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
         this.categories = data; 
        this.loading = false; 
      },
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.error = 'Erreur de chargement'; this.loading = false;
      }
    });
  }

  addCategory() {
    if (!this.newCategory.name.trim()) return;

    this.categoryService.createCategory({ name: this.newCategory.name, description: this.newCategory.name }).subscribe({
      next: () => {
        this.newCategory.name = '';
        this.loadCategories();
      },
      error: (err) => { console.error('Erreur d’ajout', err); }
    });
  }

  startEdit(category: any) {
    this.editingCategory = { ...category };
  }

  saveEdit() {
    this.categoryService.updateCategory(this.editingCategory.id, { name: this.editingCategory.name, description: this.editingCategory.name }).subscribe({
      next: () => {
        this.editingCategory = null;
        this.loadCategories();
      },
      error: (err) => { console.error('Erreur de mise à jour', err); }
    });
  }

  cancelEdit() {
    this.editingCategory = null;
  }

  deleteCategory(id: number) {
    if (confirm('Supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => { this.loadCategories(); },
        error: (err) => { console.error('Erreur de suppression', err); }
      });
    }
  }

}
