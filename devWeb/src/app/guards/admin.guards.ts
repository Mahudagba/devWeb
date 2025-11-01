import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private authService: AuthService) { }


    canActivate(): boolean {
        return this.checkAccess();
    }

    canActivateChild(): boolean {
        return this.checkAccess();
    }

    private checkAccess(): boolean {
        const user = this.authService.getCurrentUserSavedInfo();

        // if (!user) {
        //   console.warn('Aucun utilisateur connecté');
        //   this.router.navigate(['/login']);
        //   return false;
        // }

        if (user.role === 'admin') {
            console.log('Accès autorisé pour :', user.role);
            return true;
        }

        console.warn('Accès refusé pour :', user.role);
        this.router.navigate(['/']);
        return false;
    }
}
