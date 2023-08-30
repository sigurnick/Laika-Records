import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() isAdminLoggedParent!: boolean
  @Output() childLogOutEven = new EventEmitter()

  constructor(private authService: AuthService, private firebaseService: FireDBService,) { }


  logOut() {

   this.firebaseService.removeUserData()


  }

  //quando clicco su logout cambia la variabile isAdminLogged del componente padre
  //esegue il logout dell' utente admin e riporta al login
  modifyParentVariable() {
   this.firebaseService.removeUserData()
    this.isAdminLoggedParent = false
    this.childLogOutEven.emit(this.isAdminLoggedParent)
    this.authService.logout()
  }

}
