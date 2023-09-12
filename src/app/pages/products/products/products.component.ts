import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  items: any[] = [];
  isLoading: boolean = true;
  mobileSideStatus: string = ''

  //item filte
  artists: string[] = []


  constructor(private firebaseService: FireDBService) { }

  ngOnInit() {
    initFlowbite();
    this.firebaseService.getAllItems().subscribe((data) => {
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



      //ordina gli oggetti in base alle ultime uscite
      this.items = this.items.sort((a, b) => {
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
      console.log(this.items);
      this.isLoading = false

      //prendo tutti gli artisti
      this.artists = this.items.map(item => item.artists[0].name)
    });
  }

  openMobileSide() {
    this.mobileSideStatus = 'open'
  }

  closeMobileSide() {
    this.mobileSideStatus = 'closeed';
  }

}
