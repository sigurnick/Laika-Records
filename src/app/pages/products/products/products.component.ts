import { Component, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { IUser } from 'src/app/interfaces/user';
import { FireDBService } from 'src/app/services/fire-db.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  items: IRecordOnDatabase[] = [];
  itemsRes: any[] = []
  isLoading: boolean = true;
  mobileSideStatus: string = ''
  isFilterActive: boolean = false
  private artistSubscription!: Subscription
  userData?: IUser

  //item filte
  artists: string[] = []
  genres: string[] = []
  labels: string[] = []
  itemsOnView: IRecordOnDatabase[] = []
  titles: string[] = []
  //filter name value
  artistFilterValue: string = 'Artist'
  genreFilterValue: string = 'Genre'
  labelFilterValue: string = 'Label'
  genericFilterValue: string = 'Newest released'

  itemAddedToCartEvent: boolean = false;
  itemAddedTocart!: IRecordOnDatabase


  constructor(private firebaseService: FireDBService, private sharedVariablesService: SharedVariablesService, private purchaseService: PurchaseService) { }

  ngOnInit() {
    initFlowbite();
    //---------------------------[Prendo informazioni iniziali]-------------------------
    this.firebaseService.getAllItems().subscribe((data) => {


      //converte le categorie in array
      const categories = Object.values(data);

      //prende gli oggetti item di ogni categoria e li trasforma in array
      categories.forEach((category) => {
        const albumObjects = Object.values(category);
        this.itemsRes = this.itemsRes.concat(albumObjects);
      });

      // rimuove i duplicati dall'array
      const uniqueArray = this.itemsRes.reduce((result, item) => {
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


      //---------------------------[Creo array Artisti - Genere - Label]-------------------------

      //prendo tutti gli artisti
      this.artists = this.items.map(item => item.artists[0].name)
      //li ordino per iniziale del nome
      this.artists.sort((a, b) => {

        const firstLetterA = a.charAt(0).toLowerCase();
        const firstLetterB = b.charAt(0).toLowerCase();

        if (firstLetterA < firstLetterB) {
          return -1;
        }
        if (firstLetterA > firstLetterB) {
          return 1;
        }
        return 0;
      })

      this.itemsOnView = this.items //copia



      //tolgo artisti duplicati
      this.artists = this.artists.filter((name, index, arr) => {
        return arr.indexOf(name) === index
      })


      //prendo generi
      this.items.forEach((item) => {
        item.genres.forEach((genre) => {
          this.genres.push(genre);
        })
      })
      this.genres = this.genres.filter((name, index, arr) => {
        return arr.indexOf(name) === index
      })


      //prendo etichette
      this.labels = this.items.map(item => item.labels[0].name)
      //tolgo labels duplicati
      this.labels = this.labels.filter((name, index, arr) => {
        return arr.indexOf(name) === index
      })


      //li ordino per iniziale del nome
      this.labels.sort((a, b) => {

        const firstLetterA = a.charAt(0).toLowerCase();
        const firstLetterB = b.charAt(0).toLowerCase();

        if (firstLetterA < firstLetterB) {
          return -1;
        }
        if (firstLetterA > firstLetterB) {
          return 1;
        }
        return 0;
      })

      //---------------------------[Variabili esterne]-------------------------
      //quando l'utente arriva da una pagina avendo cliccato su un artista
      //attivo il filtro artista
      this.artistSubscription = this.sharedVariablesService.getArtistName().subscribe((artist) => {
        if (artist)
          this.filterArtist(artist)
      })

      this.sharedVariablesService.getSearchText().subscribe((searchText) => {

        if (searchText) {
          //è stata effettuata una ricerca
          //converto la ricerca in lowercase
          const searchTextLowerCase = searchText.toLowerCase();
          //recupero tutti i titoli degli album e li converto in lower case
          this.titles = this.items.map(item => item.title)
          const titlesLowerCase = this.titles.map(title => title.toLocaleLowerCase())

          const artistLowerCase = this.artists.map(artist => artist.toLowerCase())
          if (artistLowerCase.includes(searchTextLowerCase)) {
            this.filterArtist(searchText)
          } else if (titlesLowerCase.includes(searchTextLowerCase)) {
            this.itemsOnView = this.items.filter(item => item.title.toLowerCase() === searchTextLowerCase)
          }
        }


      })
    });

    this.firebaseService.userData$.subscribe((user) => {
      if (user)
        this.userData = user
    })
  }

  openMobileSide() {
    this.mobileSideStatus = 'open'
  }

  closeMobileSide() {
    this.mobileSideStatus = 'closeed';
  }

  //aggiungo item al carrello
  addItemOnCart(item: IRecordOnDatabase) {
    if(this.userData != null){
      this.purchaseService.newCartItem(item)

      this.itemAddedTocart = item
      this.itemAddedToCartEvent = true;

      setTimeout(()=> {
        this.itemAddedToCartEvent = false;
      }, 3000)
    }
  }


  //---------------------------[Gestione Filtri]-------------------------
  //filtre item per artist
  filterArtist(artist: string) {
    this.labelFilterValue = 'Label'
    this.genreFilterValue = 'Genre'
    this.artistFilterValue = artist
    this.isFilterActive = true
    this.itemsOnView = this.items.filter(item => item.artists[0].name.toLowerCase() === artist.toLowerCase())
    if (this.mobileSideStatus === 'open') {
      this.mobileSideStatus = 'cloded'
    }
    this.genericFilter(this.genericFilterValue)
  }

  //filtra items per genere
  genreFilter(genre: string) {
    this.artistFilterValue = 'Artist'
    this.labelFilterValue = 'Label'
    this.genreFilterValue = genre
    this.isFilterActive = true
    this.firebaseService.getItemsByGenre(genre).subscribe((data) => {
      this.itemsOnView = Object.values(data);
      if (this.mobileSideStatus === 'open') {
        this.mobileSideStatus = 'cloded'
      }
      this.genericFilter(this.genericFilterValue)
    })
  }

  //filtra item per etichetta
  labelFilter(label: string) {
    this.labelFilterValue = label
    this.artistFilterValue = 'Artist'
    this.genreFilterValue = 'Genre'
    this.isFilterActive = true
    this.itemsOnView = this.items.filter(item => item.labels[0].name === label)
    if (this.mobileSideStatus === 'open') {
      this.mobileSideStatus = 'cloded'
    }
    this.genericFilter(this.genericFilterValue)

  }

  //resetta i 3 filtri
  resetFilter() {
    this.labelFilterValue = 'Label'
    this.genreFilterValue = 'Genre'
    this.artistFilterValue = 'Artist'
    this.genericFilterValue = 'Newest released'
    this.itemsOnView = this.items
    this.genericFilter(this.genericFilterValue)
    if (this.mobileSideStatus === 'open') {
      this.mobileSideStatus = 'cloded'
    }
  }


  genericFilter(filter: string) {
    if (filter === 'Newest released') {
      this.genericFilterValue = 'Newest released'
      this.itemsOnView = this.itemsOnView.sort((a, b) => {
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
    } else if (filter === 'Newest added') {
      this.genericFilterValue = 'Newest added'
      this.itemsOnView = this.itemsOnView.sort((a, b) => {
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
    } else if (filter === 'Most wanted') {
      this.genericFilterValue = 'Most wanted'
      this.itemsOnView = this.items.sort((a, b) => {
        if (a.wanted < b.wanted) {
          return 1;
        } else if (a.wanted > b.wanted) {
          return -1;
        } else {
          return 0;
        }
      });
    } else if (filter === 'Most collected') {
      this.genericFilterValue = 'Most collected'
      this.itemsOnView = this.items.sort((a, b) => {
        if (a.collected < b.collected) {
          return 1;
        } else if (a.collected > b.collected) {
          return -1;
        } else {
          return 0;
        }
      });
    }


  }


  ngOnDestroy() {
    this.sharedVariablesService.updateArtistName('')
    this.sharedVariablesService.updateSearchText('')
  }

  //------------------------------------------------------------------

}
