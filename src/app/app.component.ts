import { Component } from '@angular/core';
import { FireDBService } from './services/fire-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Laika-Records';
  isAdminLogged:boolean = true

  constructor(private firebaseService: FireDBService) { }

  ngOnInit() {

  }
}
