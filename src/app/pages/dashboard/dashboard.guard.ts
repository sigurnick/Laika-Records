import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { FireDBService } from 'src/app/services/fire-db.service';

export const dashboardGuard: CanActivateFn = (route, state) => {

  const firebaseService: FireDBService = inject(FireDBService)
 return firebaseService.userData$.pipe(
    map(userData => {
      if (userData?.isAdmin) {
        console.log('true');
        return true;
      } else {
        // Reindirizza l'utente a una pagina diversa se non è un amministratore.
        // Puoi utilizzare UrlTree per reindirizzare.
        return false;
      }
    })
  )



};
