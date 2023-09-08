import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { filter } from 'rxjs';
import { IUser } from 'src/app/interfaces/user';
import { IAuthResponseData } from '../auth/interfaces/auth-responde-data';
import { FireDBService } from 'src/app/services/fire-db.service';
import { NgForm } from '@angular/forms';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{



  id!: string
  isRouteOpen: boolean = false
  userData!: IUser


  constructor(private actRouter: ActivatedRoute, private router: Router, private authService: AuthService, private firebaseService: FireDBService) { }

  ngOnInit() {
    initFlowbite();
    this.isRouteOpen=false

      //prendo l'id parametro
      this.actRouter.paramMap.subscribe((params) => {
        this.id = params.get('id')!;
      });

       //prendo i dati dell'utente dal db
    this.firebaseService.userData$.subscribe((user)=> {
      if(user)
      this.userData = user;
    console.log(this.userData);

    })


  }

  ngOnCange() {
    this.isRouteOpen =!this.isRouteOpen;
  }
  openRoute() {
    this.isRouteOpen = true
  }




  logOut() {
    this.authService.logout()
  }

}


