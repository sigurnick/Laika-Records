import { Component } from '@angular/core';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { FireDBService } from 'src/app/services/fire-db.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  items: any[] = [];
  lastAddedItems: IRecordOnDatabase[] = [];

  constructor(private firebaseDatabaseService: FireDBService) { }

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

      //ordina gli oggetti in base alla data di aggiunta
      this.items.sort((a, b) => {
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

      // rimuove i duplicati dall'array
      const uniqueArray = this.items.reduce((result, item) => {
        if (!result.some((existingItem: IRecordOnDatabase) => existingItem.id === item.id)) {
          result.push(item);
        }
        return result;
      }, []);

      this.items = uniqueArray;
      this.lastAddedItems = this.items.slice(0,12)
      console.log(this.items);
console.log('lastItem',this.lastAddedItems);


    });
  }
}
