import { SharedVariablesService } from './../../services/shared-variables.service';
import { IAuthResponseData } from './../../pages/auth/interfaces/auth-responde-data';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { FireDBService } from 'src/app/services/fire-db.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { NavigationEnd, Router } from '@angular/router';

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
  userData!: IUser | null
  isScrolled = false;

  newWantedEvents: boolean = false;
  newCollectedEvents: boolean = false;
  numberItemsOnCart!: number

  isAboutPage: boolean = false;
  routerEvents: any;
  isDarkMode: boolean = false;

  constructor(
    private authService: AuthService,
    private firebaseService: FireDBService,
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedVariableService: SharedVariablesService,
    private purchaseService: PurchaseService,
    private router: Router) {
      this.routerEvents = this.router.events.subscribe(
        (event: any) => {
          if (event instanceof NavigationEnd) {

            if (event.url === '/about') {
              this.isAboutPage = true;
            } else {
             this.isAboutPage = false;
            }
          }
        }
      )
    }

  ngOnInit(): void {


    //controllo il tema nel lcoalstorage
      if(localStorage.getItem('theme') === 'dark') {
        this.activateDarkMode()
      } else {
        this.activateLightMode()
      }




    //controllo se l'utente è loggato
    this.authService.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.isLogged = true;
        this.authService.user$.subscribe((res) => {
          this.user = res;

        });

        //prendo dati utente
        this.firebaseService.userData$.subscribe((userData) => {
          this.userData = userData;
          if (userData) {
            this.purchaseService.getNumberItemsOnCart().subscribe((number) => {
              this.numberItemsOnCart = number

            })

            //controllo l' aggiunta ai preferiti
            this.sharedVariableService.getWantedEvent().subscribe((value) => {
              this.newWantedEvents = value

            })
            //controllo l'aggiunta alla collezione
            this.sharedVariableService.getCollectedEvent().subscribe((value) => {
              this.newCollectedEvents = value
            })
          }
          if (this.userData?.isAdmin) {
            this.isAdminLogged = true;
          } else {
            this.isAdminLogged = false;
          }
        })
      } else {
        this.isLogged = false;
      }

    });


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


  activateDarkMode() {
    this.isDarkMode = true;
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }

  activateLightMode() {
    this.isDarkMode= false;
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }



}
