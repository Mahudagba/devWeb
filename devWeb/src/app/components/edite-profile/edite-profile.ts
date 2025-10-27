import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edite-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edite-profile.html',
  styleUrl: './edite-profile.scss'
})
export class EditeProfile implements OnInit {
  profileForm!: FormGroup;
  user: any;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserSavedInfo();

    this.profileForm = this.fb.group({
      name: [this.user?.name || '', Validators.required],

      phone: [this.user?.phone || ''],
    });
  }


  updateProfile(): void {
    if (this.profileForm.invalid) return;

    const updatedData = {
      ...this.profileForm.value,
    };

    console.log('Données mises à jour du profil:', updatedData);

    this.authService.updateProfile(updatedData).subscribe({
      next: () => {
        alert('Profil mis à jour avec succès !');
        this.router.navigate(['/profile']);
      },
      error: () => {
        alert('Erreur lors de la mise à jour du profil.');
      }
    });
  }

  cancel(): void {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['/admin/profile']);
    } else {
      this.router.navigate(['/profile']);
    }
  }


}