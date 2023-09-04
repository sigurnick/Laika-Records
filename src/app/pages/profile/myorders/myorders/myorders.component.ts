import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { IAuthResponseData } from 'src/app/pages/auth/interfaces/auth-responde-data';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss'],
})
export class MyordersComponent {
  id!: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.id = user!.localId;

    });
  }

  goBack() {
    this.router.navigate([`/profile/${this.id}`]);
    window.location.reload()
  }


}
