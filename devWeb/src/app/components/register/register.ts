import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  signupForm!: FormGroup;

  constructor(
    private authService: AuthService,
  ) {

    this.signupForm = new FormGroup({
      username: new FormControl('Roy', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('roy@yopmail.com', [Validators.required, Validators.email]),
      password: new FormControl('password1234', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('password1234', [
        Validators.required,
        Validators.minLength(6),

      ]),
    },
      // { validators: this.passwordsMatchValidator }
    );
  }
  passwordsMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  register() {

    if (!this.signupForm.valid) return;
    let data = {

      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };

    console.log('data interface register',data);
    this.authService.register(data).subscribe({
      next:( created_data:any) =>{
        // if(!auth?.token){
        //   return;
        // }
        console.log('created_data: ',created_data);
   
        // this.authService.saveToken(auth.token);
        console.log('after saving token')
        // this.router.navigate(['/']);
        
      },
      error:(error) =>{
        console.error('Erreur lors de la connexion');
        // this.errorMesage.set('username ou mot de passe incorrecte') ; 
      }
    })
  }

}
