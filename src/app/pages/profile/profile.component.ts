import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Auth, getAuth } from "firebase/auth";
import { AuthService } from '../auth/auth.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  id!: string
  isRouteOpen: boolean = false

  constructor(private actRouter: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isRouteOpen=false

      //prendo l'id parametro
      this.actRouter.paramMap.subscribe((params) => {
        this.id = params.get('id')!;
      });
  }

  openRoute() {
    this.isRouteOpen = true

    // quando cambio rotta rimette isRouteOpen a false
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      this.isRouteOpen = false
    });
  }



}


