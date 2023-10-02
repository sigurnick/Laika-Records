import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {

  private newWantedEvent$ = new BehaviorSubject<boolean>(false); //evento aggiunto item a wanted
  private newCollectedEvent$ = new BehaviorSubject<boolean>(false); //evento aggiunto alla collezione
  private newItemAddedToDbEvent$ = new BehaviorSubject<IRecordOnDatabase | null>(null); //evento aggiunto al db

  private artistName$ = new BehaviorSubject<string>('');
  private searchText$ = new BehaviorSubject<string>('');




  constructor() { }

  //salva il nome artista
  updateArtistName(artist:string) {
    this.artistName$.next(artist);
  }
 //recupero nome artista come Observable
  getArtistName() {
    return this.artistName$.asObservable()
  }



  getItemAddedEvent() {
    return this.newItemAddedToDbEvent$.asObservable()
  }

  updateItemAdded(newItem:IRecordOnDatabase) {
    this.newItemAddedToDbEvent$.next(newItem)
  }


 //prendo newWantedEvent
  getWantedEvent() {
    return this.newWantedEvent$.asObservable();
  }

  //modifico newWantedEvent
  updateWantedEvent(newValue:boolean) {
    this.newWantedEvent$.next(newValue)
  }


 //prendo newCollectedEvent
 getCollectedEvent() {
  return this.newCollectedEvent$.asObservable();
}

//modifico newCollectedEvent
updateCollecteddEvent(newValue:boolean) {
  this.newCollectedEvent$.next(newValue)
}

   //salva la ricerca
   updateSearchText(artist:string) {
    this.searchText$.next(artist);
  }
 //recupero la ricerca
  getSearchText() {
    return this.searchText$.asObservable()
  }

}
