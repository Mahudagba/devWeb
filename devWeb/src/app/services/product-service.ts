import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 

  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(){}

  getProducts(is_active: boolean = true): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}products?is_active=${is_active ? 1 : 0}`);
  }

  getProductsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}products`);
  }
    searchProducts(query: string) {
    return this.http.get<Product[]>(`${this.apiUrl}products?search=${query}&is_active=1`);
  }
  
    deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}admin/products/${id}`);
  }

    //Créer un produit
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}admin/products`, {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categories: [...product.categories.map(cat => cat.id)],
      is_active: product.is_active ,//== true ? 1 : 0,
      image_url: product.image


    });
  }

  //Mettre à jour un produit
  updateProduct(id: number, product: Product): Observable<Product> {
   const data = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categories: [...product.categories.map(cat => cat.id)],
      is_active: product.is_active,// == true ? 1 : 0,
      image_url: product.image
      
    };
    // console.log('Données mises à jour du produit:', data);
  

    return this.http.put<Product>(`${this.apiUrl}admin/products/${id}`, data);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}products/${id}`);
  }
}
