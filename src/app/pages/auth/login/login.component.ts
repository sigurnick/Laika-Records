import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ILogin } from '../interfaces/login';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FireDBService } from 'src/app/services/fire-db.service';
import { IUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('form') form!: NgForm;
  isLoading: boolean = false
  error:string = ''
  userData!:IUser

  constructor(
    private authService: AuthService,
    private router: Router,
    private firebaseService:FireDBService

  ){}


  //login
  submitForm(form:NgForm) {

    this.isLoading = true
    let dataLogin:ILogin = {...this.form.value}
    dataLogin.returnSecureToken = true
    form.reset()

    this.authService.login(dataLogin).subscribe((data)=>{

      if(data) {
        this.firebaseService.getUserData(data.localId,data.idToken).subscribe(
          (userData)=>{

          if(userData.isAdmin == true) {
            //se l'utente è un admid lo porto alla dashboard
           this.router.navigate(['/database'])
          } else {
            //altrimenti lo porto alla home
            this.router.navigate(['/home'])
          }
                this.isLoading = false
        },
        (error) => {
          console.log(error);
          this.error = error
          console.log(this.error);
          this.isLoading = false

        })
      }

    })



  }

}




