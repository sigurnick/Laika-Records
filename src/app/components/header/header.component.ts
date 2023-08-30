import { IAuthResponseData } from './../../pages/auth/interfaces/auth-responde-data';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen: boolean = false;
  isLogged: boolean = false;
  isAdminLogged: boolean = false;
  user!: IAuthResponseData | null;
  userData!:IUser |  null

  constructor(private authService: AuthService, private firebaseService:FireDBService, private router: Router) {}

  ngOnInit(): void {

    //controllo se l'utente è loggato
    this.authService.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.isLogged = true;
        this.authService.user$.subscribe((res) => {
          this.user = res;
          console.log(this.user);
          if (this.user) {
            console.log('userid', this.user.localId);
          }
        });

        //prendo dati utente
        this.firebaseService.userData$.subscribe((userData)=> {
          this.userData = userData;
          if(this.userData?.isAdmin) {
            this.isAdminLogged = true;
          }
        })
      } else {
        this.isLogged = false;
      }

      console.log('loggato:',this.isLogged);

    });
  }

  //?barra di ricerca da implementare
  onSubmit(form: NgForm) {}

  openMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }


}
