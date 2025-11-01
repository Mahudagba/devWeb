import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.scss'
})
export class DeleteAccount {
  resetForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  private router: Router = inject(Router)


  constructor(private fb: FormBuilder, private authService: AuthService,
    private cartService: CartService) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.deleteAccount(this.resetForm.value.password).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Compte Supprimer avec succès.';
        this.loading = false;
        this.resetForm.reset();
        this.cartService.clearCart();
        this.authService.logout(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la Suppression.';
        this.loading = false;
      }
    });
  }
}
