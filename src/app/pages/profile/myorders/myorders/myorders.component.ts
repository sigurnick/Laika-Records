import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyordersComponent {
  previousUrl!: string

  constructor(private router: Router, private location:Location){}

  ngOnInit() {

  }


  goBack() {
    this.router.navigateByUrl('/');
  }

}
