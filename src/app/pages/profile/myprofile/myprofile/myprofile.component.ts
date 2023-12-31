import { FireDBService } from 'src/app/services/fire-db.service';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { IAuthResponseData } from 'src/app/pages/auth/interfaces/auth-responde-data';
import { Modal, initFlowbite } from 'flowbite'
import type { ModalOptions, ModalInterface } from 'flowbite'
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent {
  @ViewChild('editNameForm') editNameForm!: NgForm;
  @ViewChild('editPasswordForm') editPasswordForm!: NgForm;

  id!: string;
  userAuth!: IAuthResponseData
  userData!: IUser;
  nameUser!:string
  surnameUser!:string

  showUpdatePasswordAlert: boolean = false
  updatePasswordError: string = ''


  constructor(private authService: AuthService, private router: Router, private firebaseService: FireDBService) { }

  ngOnInit() {
    initFlowbite();
    //prendo dati utente dell' authentication
    this.authService.user$.subscribe((user) => {
      if (user)
        this.userAuth = user;

    })

    //prendo i dati dell'utente dal db
    this.firebaseService.userData$.subscribe((user) => {
      if (user){

        this.userData = user;
      this.nameUser = user.name
      this.surnameUser = user.surname
      }

    })
  }

  //edit Name and Surname User
  editNameFormSubmit(form: NgForm) {


    this.firebaseService.writeUserData(this.userData.userId, this.userAuth.idToken,this.userData.email, form.value.name, form.value.surname).subscribe((resData)=>{

      if(resData){
         //prendo nuovamente i dati dell'utente dal db
    this.firebaseService.getUserData(this.userAuth.localId, this.userAuth.idToken).subscribe((user)=>{
      this.userData = user
    })
      }
    })
  }

  // edit password
  editPasswordFormSubmit(form: NgForm) {

if(form.value.newPassword.length >= 6){
  this.authService.updatePassword(this.userAuth,form.value.newPassword).subscribe((resData)=> {


  })
} else {
  this.updatePasswordError = 'Password must contain at least 6 characters'
  this.showUpdatePasswordAlert = true
  setInterval(()=>{
  this.showUpdatePasswordAlert = false
  },4000)
}
  }

  //delete account
  deleteAccount() {
    this.authService.deleteAccount(this.userAuth).subscribe((resData)=> {
      console.log(resData);
      this.router.navigate(['/home']);

    })
  }


  goBack() {
    this.router.navigate([`/profile/${this.id}`]);
    window.location.reload()

  }
}
