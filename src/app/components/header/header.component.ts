import { IAuthResponseData } from './../../pages/auth/interfaces/auth-responde-data';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
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
  isScrolled = false;

  newWantedEvents: boolean = false;


  constructor(private authService: AuthService, private firebaseService:FireDBService, private renderer: Renderer2,
    private el: ElementRef) {}

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

    this.firebaseService.getWantedEvent().subscribe((value)=> {
      this.newWantedEvents = value
      console.log(this.newWantedEvents);

    })
  }

  openMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }


  //cambia la variabile allo scroll del mouse in basso
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;

    if (scrollY > 30) {
      this.isScrolled = true;

      this.renderer.addClass(this.el.nativeElement, 'scrolled');
    } else {
      this.isScrolled = false;

      this.renderer.removeClass(this.el.nativeElement, 'scrolled');
    }
  }

}
