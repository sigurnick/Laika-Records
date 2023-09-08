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


  constructor(private authService: AuthService, private router: Router, private firebaseService: FireDBService) { }

  ngOnInit() {
    initFlowbite();
    //prendo dati utente dell' authentication
    this.authService.user$.subscribe((user) => {
      if (user)
        this.userAuth = user;
      console.log(this.userAuth);

    })

    //prendo i dati dell'utente dal db
    this.firebaseService.userData$.subscribe((user) => {
      if (user){

        this.userData = user;
      this.nameUser = user.name
      this.surnameUser = user.surname
      console.log(this.userData);
      }

    })
  }

  //edit Name and Surname User
  editNameFormSubmit(form: NgForm) {


    this.firebaseService.writeUserData(this.userData.userId, this.userAuth.idToken,this.userData.email, form.value.name, form.value.surname).subscribe((resData)=>{
      console.log(resData);

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
    console.log(form);

if(form.value.newPassword.length >= 6){
  this.firebaseService.updatePassword(form.value.password)
}
  }

  goBack() {
    this.router.navigate([`/profile/${this.id}`]);
    window.location.reload()

  }
}
