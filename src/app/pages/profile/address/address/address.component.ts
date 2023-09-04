import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {

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
