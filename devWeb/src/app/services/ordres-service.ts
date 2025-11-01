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

createOrderByAdmin(data: { user_id: any; status: any; total: number; items: { product_id: any; quantity: any; }[]; }) {
    return this.http.post(`${this.apiUrl}admin/orders/create`, data);
  }

updateOrderStatus(id: number, status: string) {
  return this.http.put(`${this.apiUrl}admin/orders/${id}/status`, { status: status });
}

deleteOrder(id: any) {
    return this.http.delete(`${this.apiUrl}admin/orders/${id}`);
  }
  
}
