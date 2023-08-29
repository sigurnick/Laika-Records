import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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

  constructor(private actRouter: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isRouteOpen=false

      //prendo l'id parametro
      this.actRouter.paramMap.subscribe((params) => {
        this.id = params.get('id')!;
      });
  }

  ngOnCange() {
    this.isRouteOpen =!this.isRouteOpen;
  }
  openRoute() {
    this.isRouteOpen = true

    // quando cambio rotta rimette isRouteOpen a false
    // this.router.events.pipe(
    //   filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {

    //   if(this.isRouteOpen === true) {
    //     this.isRouteOpen = false
    //   }


    // })
  }




  logOut() {
    this.authService.logout()
  }

}


