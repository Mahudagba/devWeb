import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

    private apiUrl = 'http://127.0.0.1:8000/api/'; 

  constructor(private http: HttpClient) {}
    // Récupérer toutes les catégories
    getStats() {
      return this.http.get(this.apiUrl + 'admin/stats');
    }
}
