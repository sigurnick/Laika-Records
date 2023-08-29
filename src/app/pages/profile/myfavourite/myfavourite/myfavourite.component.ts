import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-myfavourite',
  templateUrl: './myfavourite.component.html',
  styleUrls: ['./myfavourite.component.scss']
})
export class MyfavouriteComponent {
  id!: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.id = user!.localId;
      console.log(
        '🚀 ~ file: myorders.component.ts:23 ~ MyordersComponent ~ ngOnInit ~ this.id:',
        this.id
      );
    });
  }

  goBack() {
    this.router.navigate([`/profile/${this.id}`]);
  }
}
