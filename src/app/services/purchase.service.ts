import { IRecordOnCart } from './../interfaces/recordOnCart';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRecordOnDatabase } from '../interfaces/recordOnDatabase';
import { RecordOnCart } from '../models/recordOnCart.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private newCartItemEvent$ = new BehaviorSubject<boolean>(false);
  cartItems: IRecordOnCart[] = [];
  numberOfItemsInCart!: number

  constructor() { }


    newCartItem(item:IRecordOnDatabase) {

      const itemOnCart = new RecordOnCart(item,1)
      this.newCartItemEvent$.next(true);
      this.cartItems.push(itemOnCart);
    }


    getNewItemCartEvent() {
      return this.newCartItemEvent$.asObservable()
    }






}
