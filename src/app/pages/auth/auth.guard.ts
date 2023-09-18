import {  CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';

export const authGuard: CanActivateFn = () => {

  const authService: AuthService = inject(AuthService)

  return authService.isLoggedIn$.pipe(map((isLoggedIn: any) => {
    return isLoggedIn
  }))

};
