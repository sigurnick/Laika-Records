import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { IRecordOnCart } from 'src/app/interfaces/recordOnCart';
import { PurchaseService } from 'src/app/services/purchase.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

import { render } from 'creditcardpayments/creditCardPayments'
import { FireDBService } from 'src/app/services/fire-db.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: IRecordOnCart[] = []
  totalItemsPrice: number = 0
  shippingCost: number = 7
  totalOrderCost!: number
  totalOrderCorstString: string = ""

  @ViewChild('paypallButtons', { static: false }) paypallButtonsElement!: ElementRef;
  totalOrderCostUpdated = new EventEmitter<string>();

  constructor(private purchaseService: PurchaseService, private sharedVariablesService: SharedVariablesService, private firebaseService: FireDBService) {

  }

  ngOnInit() {
    initFlowbite();
    this.cartItems = this.purchaseService.getCartItems()
    this.updatePrice()

  }

  ngAfterViewInit() {

    // paypall buttons
    render(
      {
        id: "#paypallButtons",
        currency: "EUR",
        value: this.totalOrderCorstString,
        onApprove: (details) => {
          alert("Transition successful")
          this.orderComplete()
        }
      }
    )
    console.log(this.paypallButtonsElement);

  }
  //manda ad artist
  sendArtistName(artist: string) {
    this.sharedVariablesService
      .updateArtistName(artist)
  }


  //aggiunge di una la quantità
  addQuantity(item: IRecordOnCart, index: number) {
    if (item.quantity != item.item.quantity) {
      item.quantity++
      this.purchaseService.changeQuantityItem(index, item.quantity)
      this.updatePrice()

    }
  }

  //timuove una quantità
  removeQuantity(item: IRecordOnCart, index: number) {
    if (item.quantity === 1) {
      this.removeItem(index)
    } else {
      item.quantity--
      this.purchaseService.changeQuantityItem(index, item.quantity)
      this.updatePrice()
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 0)
    this.purchaseService.removeItemOnCart(index)
    this.updatePrice()
  }

  //aggiorna il prezo totale dell' ordine
  updatePrice() {

    this.totalItemsPrice = 0
    this.cartItems.forEach((item) => {
      this.totalItemsPrice = +this.totalItemsPrice + (+item.item.price * item.quantity)
    })
    if (this.totalItemsPrice >= 99) {
      this.totalOrderCost = +this.totalItemsPrice
    } else {
      this.shippingCost = 7
      this.totalOrderCost = +this.shippingCost + +this.totalItemsPrice
    }
    this.totalOrderCorstString = this.totalOrderCost.toString()

  }


  orderComplete() {
    //cambio la quantità di ogni oggetto nel database
    this.cartItems.forEach((item) => {
      let quantity = 0
      if (item.item.quantity - item.quantity > 0) {
        quantity = item.item.quantity - item.quantity
      }

      item.item.genres.forEach((genre) => {
        this.firebaseService.updateItemQuantity(item.item, quantity, genre).subscribe((resdata) => {
          console.log(resdata);

        })
      })
    })

    //svuoto il local storage e il carrello
    this.cartItems = []
    localStorage.removeItem('userCart')
    this.purchaseService.emptyCart()
  }
}
