import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { IUser } from 'src/app/interfaces/user';
import { FireDBService } from 'src/app/services/fire-db.service';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {



  id!: string
  isRouteOpen: boolean = false
  userData!: IUser
  name!:string
  surname!:string


  constructor(private actRouter: ActivatedRoute, private authService: AuthService, private firebaseService: FireDBService) { }

  ngOnInit() {
    initFlowbite();
    this.isRouteOpen = false

    //prendo l'id parametro
    this.actRouter.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
    });

    //prendo i dati dell'utente dal db
    this.firebaseService.userData$.subscribe((user) => {
      if (user) {

        this.userData = user;
        this.name = user.name;
        this.surname = user.surname;
      }

    })
  }

  ngOnCange() {
    this.isRouteOpen = !this.isRouteOpen;
  }
  openRoute() {
    this.isRouteOpen = true
  }




  logOut() {
    this.authService.logout()
  }

}


