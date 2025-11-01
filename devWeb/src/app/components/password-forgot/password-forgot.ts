import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service';

@Component({
  selector: 'app-password-forgot',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-forgot.html',
  styleUrl: './password-forgot.scss'
})
export class PasswordForgot {
  loginForm: FormGroup;
  errorMesage = signal('');
  private router: Router = inject(Router);
  mail: string = '';


  constructor(
    private authService: AuthService,
    private dataService:DataService

  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('user@example.com', [Validators.required, Validators.minLength(3)]),
    });
  }




  send() {
    if (!this.loginForm.valid) {
      this.errorMesage.set('email ou mot de passe incorrecte');
      return;
    }
    this.mail = this.loginForm.value.email;
    this.authService.passwordForgot({ email: this.mail },).subscribe({
      next: (auth: any) => {

        console.log('Auth: ', auth);
        console.log('after saving token');
        alert(auth.message);
        this.dataService.setData({ email: this.mail })
        this.router.navigate(['/reset-password',]);


      },
      error: (error) => {
        console.error('Erreur lors de la connexion');
      }
    })
  }
}
