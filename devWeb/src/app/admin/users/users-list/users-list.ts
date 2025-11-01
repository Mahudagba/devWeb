import { Component } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList {
  users: any[] = [];
  loading = false;
  selectedUser: any
  loadingCreate = false;
  error = '';
  showForm = false;
  showEditForm = false;
  roleToCreate: 'customer' | 'admin' = 'customer';
  userForm: FormGroup;
  updateUserForm: FormGroup;

  constructor(private usersService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', Validators.required]
    });

    this.updateUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  toggleForm(role: 'customer' | 'admin') {
    this.showEditForm = false
    if (this.showForm && this.roleToCreate === role) {
      this.showForm = false;
    } else {
      this.showForm = true;

      this.roleToCreate = role;
    }
    this.roleToCreate = role;
  }


  fetchUsers() {
    this.usersService.getAllUsers().subscribe({
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
  viewUser(user: any) {
    this.selectedUser = user;
    this.updateUserForm = this.fb.group({
      name: [user.name, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone],
      role: [user.role, Validators.required]
    });
    this.showEditForm = true;
    this.showForm = false
  }

  closeForm() { 
    this.showEditForm = false;
    this.showForm = false
  }

  updateUser() {

    if (this.updateUserForm.invalid) return;
    this.loadingCreate = true;
    const data = { ...this.updateUserForm.value};


    if (confirm('Voulez-vous vraiment modifier cet utilisateur ?')) {
      this.usersService.updateUser(this.selectedUser.id,data).subscribe({
        next: () => {
          alert('Utilisateur modifier');
          this.loadingCreate = false;
          this.showEditForm = false;
          this.fetchUsers();
        },
        error: (err) => {
        alert('Erreur : ' + err.message);
        this.loadingCreate = false;
      }
      });
    }
  }


  createUser() {
    if (this.userForm.invalid) return;
    this.loadingCreate = true;
    const userData = { ...this.userForm.value, role: this.roleToCreate };


    this.usersService.createUser(userData).subscribe({
      next: () => {
        alert('Utilisateur créé avec succès');
        this.loadingCreate = false;
        this.userForm.reset();
        this.showForm = false;
        this.fetchUsers();
      },
      error: (err) => {
        alert('Erreur : ' + err.message);
        this.loadingCreate = false;
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          alert('Utilisateur supprimé');
          this.fetchUsers();
        },
        error: (err) => alert('Erreur : ' + err.message)
      });
    }
  }



  sendResetPasswordEmail(email: string) {
    if (confirm('Voulez-vous vraiment un mail de reinitialisation de mot de passe ?')) {
      this.usersService.sendResetPasswordEmail(email).subscribe({
        next: () => alert('Email de réinitialisation envoyé.'),
        error: (err) => alert('Erreur : ' + err.message)
      });
    }
  }

}
