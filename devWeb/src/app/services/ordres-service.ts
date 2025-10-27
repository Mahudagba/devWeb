import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdresService {
  private apiUrl = 'http://127.0.0.1:8000/api/'; 
  constructor(private http: HttpClient) {}
  getOrders() {
  return this.http.get<any[]>(this.apiUrl + 'admin/orders');
}

getOrderById(id: string) {
  return this.http.get(`${this.apiUrl}admin/orders/${id}`);
}

updateOrderStatus(id: number, status: string) {
  return this.http.put(`${this.apiUrl}admin/orders/${id}/status`, { status: status });
}
  
}
