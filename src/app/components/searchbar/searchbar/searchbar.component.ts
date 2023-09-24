import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  searchInput!: string
  isInputUsed!: boolean
  showSearchBar: boolean = true
  routerEvents: any;

  constructor(private sharedVariablesService: SharedVariablesService, private router: Router) {
    this.routerEvents = this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {

          if (event.url === '/login' || event.url === '/register' || event.url === '/about') {
            this.showSearchBar = false;
          } else {
            this.showSearchBar = true

          }


        }
      }
    )
  }

  ngOnInit() {

  }

  searchOnSubmit() {
    this.sharedVariablesService.updateSearchText(this.searchInput)
    this.searchInput = ''
    this.router.navigate(['/products'])
  }

  //mostra/nasconde icone cerca
  onInputChange() {
    if (this.searchInput) {
      this.isInputUsed = true
    } else {
      this.isInputUsed = false
    }
  }

}
