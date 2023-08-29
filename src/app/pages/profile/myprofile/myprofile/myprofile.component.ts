import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent {
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
