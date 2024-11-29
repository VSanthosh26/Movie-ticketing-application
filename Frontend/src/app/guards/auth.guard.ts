import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(NgToastService);

  if (auth.isLoggedIn()) {
    return true;
  } else {
    toast.danger("Error",'Please Login First!',5000);
    router.navigate(['/login']); // Redirecting to login
    return false;
  }
};
