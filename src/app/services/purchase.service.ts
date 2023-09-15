import { IRecordOnCart } from './../interfaces/recordOnCart';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRecordOnDatabase } from '../interfaces/recordOnDatabase';
import { RecordOnCart } from '../models/recordOnCart.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private numberItemsOnCart$ = new BehaviorSubject<number>(0);
  cartItems: IRecordOnCart[] = [];


  constructor() { this.restoreCart() }


  newCartItem(record: IRecordOnDatabase) {
    if(this.cartItems.length>0) {
      //controllo se l'item è già nel carrello
      const findItemIndex = this.cartItems.findIndex(item => item.item.id === record.id);
      //se  torna diverso da -1 significa che è già presente
      //quindi aumento la quantità
      if(findItemIndex !== -1) {
        this.cartItems[findItemIndex].quantity++
      } else {
        const itemOnCart = new RecordOnCart(record, 1)
        this.cartItems.push(itemOnCart);
      }
    } else {

      //il carrello è vuoto
      const itemOnCart = new RecordOnCart(record, 1)
      this.cartItems.push(itemOnCart);
    }

    localStorage.setItem('userCart', JSON.stringify(this.cartItems));
    this.numberItemsOnCart$.next(this.cartItems.length)
  }


  getNumberItemsOnCart() {
    return this.numberItemsOnCart$.asObservable()
  }

  getCartItems() {
    return this.cartItems
  }


  restoreCart() {
    const cartJson: string | null = localStorage.getItem('userCart'); //recupero i dati
    if (!cartJson) return; //se i dati non ci sono blocco la funzione
    const userCart: IRecordOnCart[] = JSON.parse(cartJson); //se viene eseguita questa riga significa che i dati ci sono, quindi converto la stringa(che conteneva un json) in oggetto
    this.cartItems = userCart
    this.numberItemsOnCart$.next(this.cartItems.length)
  }

}
