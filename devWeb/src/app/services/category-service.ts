import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://127.0.0.1:8000/api/'; 

  constructor(private http: HttpClient) {}

  // Récupérer toutes les catégories
  getCategories()  {
    return this.http.get<Category[]>(this.apiUrl + 'categories');
  }



  // Créer une nouvelle catégorie
  createCategory(data: any) {
    return this.http.post<Category>(`${this.apiUrl}admin/categories`, data);
  }

  //Mettre à jour une catégorie existante
  updateCategory(id: number, data: any) {
    return this.http.put<Category>(`${this.apiUrl}admin/categories/${id}`, data);
  }

  // Supprimer une catégorie
  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}admin/categories/${id}`);
  }
}
