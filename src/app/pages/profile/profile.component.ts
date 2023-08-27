import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth, getAuth } from "firebase/auth";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  id!: string

  constructor(private actRouter: ActivatedRoute) { }

  ngOnInit() {

      //prendo l'id parametro
      this.actRouter.paramMap.subscribe((params) => {
        this.id = params.get('id')!;
      });





      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          console.log(user);

          // ...
        } else {
          // User is signed out
          // ...
        }
      });


  }

}
function onAuthStateChanged(auth: Auth, arg1: (user: any) => void) {
  throw new Error('Function not implemented.');
}

