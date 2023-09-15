import { SharedVariablesService } from './../../services/shared-variables.service';
import { Component } from '@angular/core';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { FireDBService } from 'src/app/services/fire-db.service';
import { initFlowbite } from 'flowbite';
import { IUser } from 'src/app/interfaces/user';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showHeartButton: boolean[] = [];
  titleTolpit: boolean[] = [];

  //record array
  items: any[] = [];
  lastAddedItems: IRecordOnDatabase[] = [];
  lastReleasedItems: IRecordOnDatabase[] = [];
  mostFavouritedItems: IRecordOnDatabase[] = [];
  mostSoldItems: IRecordOnDatabase[] = [];
  isLoading: boolean = false;
  userData!: IUser

  constructor(private firebaseDatabaseService: FireDBService, private sharedVariablesService: SharedVariablesService, private purchaseService: PurchaseService) { }

  ngOnInit() {
    initFlowbite();
    this.firebaseDatabaseService.getAllItems().subscribe((data) => {
      //converte le categorie in array
      const categories = Object.values(data);

      //prende gli oggetti item di ogni categoria e li trasforma in array
      categories.forEach((category) => {
        const albumObjects = Object.values(category);
        this.items = this.items.concat(albumObjects);
      });



      // rimuove i duplicati dall'array
      const uniqueArray = this.items.reduce((result, item) => {
        if (!result.some((existingItem: IRecordOnDatabase) => existingItem.id === item.id)) {
          result.push(item);
        }
        return result;
      }, []);

      this.items = uniqueArray;

      //ordina gli oggetti in base alla data di aggiunta
      this.lastAddedItems = this.items.sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);

        if (dateA < dateB) {
          return 1;
        } else if (dateA > dateB) {
          return -1;
        } else {
          return 0;
        }
      });
      //ultimi articoli aggiunti
      this.lastAddedItems = this.lastAddedItems.slice(0,12)
      console.log('lastItem',this.lastAddedItems);

      //ordina gli oggetti in base alle ultime uscite
      this.lastReleasedItems = this.items.sort((a, b) => {
        const dateA = new Date(a.released);
        const dateB = new Date(b.released);

        if (dateA < dateB) {
          return 1;
        } else if (dateA > dateB) {
          return -1;
        } else {
          return 0;
        }
      });
      this.lastReleasedItems = this.lastReleasedItems.slice(0,12)
      console.log('lastReleasedItem',this.lastReleasedItems);


      //ordina gli oggetti in base ai più preferiti
      this.mostFavouritedItems = this.items.sort((a, b) => {
        if (a.wanted < b.wanted) {
          return 1;
        } else if (a.wanted > b.wanted) {
          return -1;
        } else {
          return 0;
        }
      });
      this.mostFavouritedItems = this.mostFavouritedItems.slice(0,12)
      console.log('mostFav',this.mostFavouritedItems);
      this.isLoading = true



    });

    this.firebaseDatabaseService.userData$.subscribe((user)=>{
      if(user)
      this.userData = user;
    })
  }

//aggiungo item al carrello
addItemOnCart(item: IRecordOnDatabase) {
  if(this.userData != null){
    this.purchaseService.newCartItem(item)
  }
}


  //todo da implementare tolpit titolo
  showTitleTolpit(i:number) {
    this.titleTolpit[i] = true;
  }
  hideTitleTolpit(i:number) {
    this.titleTolpit[i] = false;
  }



  showHeart(i:number) {
    this.showHeartButton[i] = true;

    }

    hideHeart(i:number) {
      this.showHeartButton[i] = false;
    }

    sendArtistName(artist:string) {
      this.sharedVariablesService
      .updateArtistName(artist)
    }
}
