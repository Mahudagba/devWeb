import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private apiUrl = 'http://localhost:8000/api/admin/users/';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
  
}
