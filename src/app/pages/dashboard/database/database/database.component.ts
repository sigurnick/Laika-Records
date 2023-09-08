import { Component, OnInit } from '@angular/core';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss'],
})
export class DatabaseComponent implements OnInit {
  items: any[] = [];


  constructor(private firebaseDatabaseService: FireDBService) { }

  ngOnInit() {
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
      console.log(this.items);

      //prende l'url dell' immagine di ogn iitems
      this.items.forEach((item)=>{
        this.firebaseDatabaseService.getImage(item).then((url)=>{
          item.url = url;
        })
      })



    });
  }

  //---------------------------[Gestione Items nel Database]-------------------------
  //aggiunge una quantità all' oggetto nel db
  addQuantity(item: IRecordOnDatabase) {
    if (item.quantity) {

      item.quantity++

      item.genres.forEach((element) => {
        this.firebaseDatabaseService
          .addQuantityToItem(item, element)
          .subscribe((resData) => {
            console.log(resData);
          });
      });
    }
  }

  //rimuove una quantità all' oggetto nel db
  removeQuantity(item: IRecordOnDatabase) {
    //se la quantità è uguale a zero rimuove l'oggetto dal db
    if (item.quantity === 1) {
      console.log(item.quantity);

      this.eliminateItem(item)

    }else {

      if (item.quantity) {

        item.quantity--

        item.genres.forEach((element) => {
          this.firebaseDatabaseService
            .addQuantityToItem(item, element)
            .subscribe((resData) => {
              console.log(resData);
            });
        });
      }
    }
  }

  //rimuove completamente oggeto nel db
  eliminateItem(item: IRecordOnDatabase) {
    console.log(item);

    item.genres.forEach((element) => {
      this.firebaseDatabaseService
        .eliminateItem(item, element)
        .subscribe((resData) => {
          console.log(resData);
        });
    });
  }
  //------------------------------------------------------------------
}
