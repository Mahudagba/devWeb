import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}admin/users/`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}admin/users/${id}`);
  }

  createUser(data: any) {
     if (!confirm(`${data.role}`)) {
      
      return this.http.post(`${this.apiUrl}admin/users/`, {});
    }
    return this.http.post(`${this.apiUrl}admin/users/`, data);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${this.apiUrl}admin/users/${id}`, data);
  }


  sendResetPasswordEmail(email: string) {
    return this.http.post(`${this.apiUrl}forgot-password`, { email:email });
  }
  
}
