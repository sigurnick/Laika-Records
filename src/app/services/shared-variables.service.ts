import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {

  private newWantedEvent$ = new BehaviorSubject<boolean>(false); //evento aggiunto item a wanted
  private artistName$ = new BehaviorSubject<string>('');


  constructor() { }

  updateArtistName(artist:string) {
    this.artistName$.next(artist);
  }

  getArtistName() {
    return this.artistName$.asObservable()
  }




 //prendo newWantedEvent
  getWantedEvent() {
    return this.newWantedEvent$.asObservable();
  }

  //modifico newWantedEvent
  updateWantedEvent(newValue:boolean) {
    this.newWantedEvent$.next(newValue)
  }
}
