import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data-service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
resetForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  email:string =''
  // private router:Router = inject(Router)


  constructor(private fb: FormBuilder, private authService:AuthService,private dataService: DataService ) {
    this.email = this.dataService.getData().email;
    this.resetForm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

     this.authService.resetPassword(this.resetForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Mot de passe réinitialisé avec succès.';
        this.loading = false;
        this.resetForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la réinitialisation.';
        this.loading = false;
      }
    });
  }
}
