import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { IAuthResponseData } from 'src/app/pages/auth/interfaces/auth-responde-data';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-myfavourite',
  templateUrl: './myfavourite.component.html',
  styleUrls: ['./myfavourite.component.scss']
})
export class MyfavouriteComponent {
  id!: string;
  userAuth!: IAuthResponseData
  userData!: IUser
  collection: IRecordOnDatabase[] = []

  constructor(private authService: AuthService, private router: Router, private firebaseService: FireDBService) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.id = user!.localId;

      //prendo dati utente
      this.authService.user$.subscribe((user)=>{
        if(user) {
          this.userAuth = user
          this.firebaseService.userData$.subscribe((userData) => {
            if(userData) {
              this.userData = userData
              //ora recupero la lista collection
              this.firebaseService.getUserCollection(this.userData, this.userAuth).subscribe((collection)=> {
                this.collection = Object.values(collection); //trasforma in array
                console.log(this.collection);

              })
            }
          })
        }
      })
    });
  }

  goBack() {
    this.router.navigate([`/profile/${this.id}`]);
    window.location.reload()
  }

  removeFromCollection(item: IRecordOnDatabase,i:number) {
    this.firebaseService.removeRecordWanted(this.userData, this.userAuth, item).subscribe((res)=> {
      this.collection.splice(i,1)
    })
  }
}
