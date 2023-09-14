import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {

  searchInput!: string
  isInputUsed!: boolean

  constructor(private sharedVariablesService: SharedVariablesService, private router: Router) {}

  searchOnSubmit() {
    this.sharedVariablesService.updateSearchText(this.searchInput)
    this.searchInput = ''
    this.router.navigate(['/products'])
  }

  //mostra/nasconde icone cerca
  onInputChange() {
    if(this.searchInput) {
      this.isInputUsed = true
    } else {
      this.isInputUsed = false
    }
  }

}
