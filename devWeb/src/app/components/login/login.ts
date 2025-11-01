import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  errorMesage = signal('')
  private router: Router = inject(Router)


  constructor(
    private authService: AuthService,

  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('user@example.com', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('stringst', [Validators.required, Validators.minLength(4)]),
    });
  }




  login() {
    if (!this.loginForm.valid) {
      this.errorMesage.set('email ou mot de passe incorrecte');
      return;
    }
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (auth: any) => {
        // if(!auth?.token){
        //   return;
        // }
      
        console.log('Auth: ', auth.user.role);
        this.errorMesage.set('');
        console.log('after saving token');
        this.authService.saveUserInfo(auth);
           if (auth.user.role === 'admin') {
          this.router.navigate(['/admin']);
        }
        else {
          this.router.navigate(['/']);
        }
        
       

      },
      error: (error) => {
        console.error('Erreur lors de la connexion');
        this.errorMesage.set('username ou mot de passe incorrecte');
      }
    })
  }
}
