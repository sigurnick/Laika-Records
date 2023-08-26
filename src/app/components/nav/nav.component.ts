import { AuthService } from './../../pages/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{
  isMenuOpen:boolean = false
  isLogged:boolean = false


  constructor (private authService: AuthService){}

  ngOnInit(): void { 
    this.authService.isLoggedIn$.subscribe(res=>{
      if(res){
        this.isLogged = true
      } else {
        this.isLogged = false
      }

      console.log(this.isLogged);
    })


  }


  onSubmit(form: NgForm) {

  }

  openMenu() {

    this.isMenuOpen = true

  }

  closeMenu() {

    this.isMenuOpen = false

  }

  logout() {
   this.authService.logout()
  }

}
