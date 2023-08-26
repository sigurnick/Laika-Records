import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ILogin } from '../interfaces/login';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('form') form!: NgForm;
  isLoading: boolean = false
  error:string = ''

  constructor(
    private authService: AuthService,
    private router: Router

  ){}


  //login
  submitForm(form:NgForm) {

    console.log(this.form.value);

    this.isLoading = true
    let dataLogin:ILogin = {...this.form.value}
    dataLogin.returnSecureToken = true
    form.reset()

    this.authService.login(dataLogin).subscribe((data)=>{

      console.log(data);
      this.isLoading = false
      this.router.navigate(['/home'])
    })



  }

}




