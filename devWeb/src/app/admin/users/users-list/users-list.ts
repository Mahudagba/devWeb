import { Component } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList {
users: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.error = 'Impossible de charger la liste des utilisateurs.';
        this.loading = false;
      },
    });
  }


}
