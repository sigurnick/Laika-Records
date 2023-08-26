import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

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
