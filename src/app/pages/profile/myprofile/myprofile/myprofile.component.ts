import { FireDBService } from 'src/app/services/fire-db.service';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { IAuthResponseData } from 'src/app/pages/auth/interfaces/auth-responde-data';
import { Modal } from 'flowbite'
import type { ModalOptions, ModalInterface } from 'flowbite'
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent {
  @ViewChild('editNameForm') form!: NgForm;

  id!: string;
  userAuth!: IAuthResponseData
  userData!: IUser;

  constructor(private authService: AuthService, private router: Router, private firebaseService: FireDBService) { }

  ngOnInit() {

    //prendo dati utente dell' authentication
    this.authService.user$.subscribe((user) => {
      if (user)
        this.userAuth = user;
      console.log(this.userAuth);

    })

    //prendo i dati dell'utente dal db
    this.firebaseService.userData$.subscribe((user) => {
      if (user)
        this.userData = user;
      console.log(this.userData);

    })
  }

  editNameForm(form: NgForm) {

  }

  goBack() {
    this.router.navigate([`/profile/${this.id}`]);
    window.location.reload()

  }
}
