import { Component } from '@angular/core';
import { FireDBService } from './services/fire-db.service';
import { IUser } from './interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Laika-Records';
  userData!: IUser;
  isAdminLogged: boolean = false;
  constructor(private firebaseService: FireDBService) {}

  ngOnInit() {
    this.firebaseService.userData$.subscribe((data) => {
      console.log('data', data);

      if (data?.isAdmin === true) {
        this.isAdminLogged = true;
      } else {
        this.isAdminLogged = false;
      }
    });
  }

  handleLogOutInChild(data: any) {
    this.isAdminLogged = false;
  }
}
