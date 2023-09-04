import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FireDBService } from 'src/app/services/fire-db.service';
import { IUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @Input() isAdminLoggedParent!: boolean;
  @Output() childLogOutEven = new EventEmitter();
  currentDay: Date = new Date();
  isScrolled = false;
  userData!: IUser

  constructor(
    private authService: AuthService,
    private firebaseService: FireDBService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {

  }


  ngOnInit() {

    this.firebaseService.userData$.subscribe((data) => {
      if(data)
      this.userData = data;
    })

  }

  //cambia la variabile allo scroll del mouse in basso
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      this.isScrolled = true;

      this.renderer.addClass(this.el.nativeElement, 'scrolled');
    } else {
      this.isScrolled = false;

      this.renderer.removeClass(this.el.nativeElement, 'scrolled');
    }
  }

  logOut() {
    this.firebaseService.removeUserData();
  }

  //quando clicco su logout cambia la variabile isAdminLogged del componente padre
  //esegue il logout dell' utente admin e riporta al login
  modifyParentVariable() {
    this.firebaseService.removeUserData();
    this.isAdminLoggedParent = false;
    this.childLogOutEven.emit(this.isAdminLoggedParent);
    this.authService.logout();
  }
}
