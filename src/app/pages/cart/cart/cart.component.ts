import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { IRecordOnCart } from 'src/app/interfaces/recordOnCart';
import { PurchaseService } from 'src/app/services/purchase.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: IRecordOnCart[] = []
  totalItemsPrice: number = 0
  shippingCost: number = 7
  totalOrderCost!:number


  constructor(private purchaseService: PurchaseService, private sharedVariablesService: SharedVariablesService) {}

ngOnInit() {
  initFlowbite();
 this.cartItems =  this.purchaseService.getCartItems()
 this.updatePrice()
}
//manda ad artist
sendArtistName(artist:string) {
  this.sharedVariablesService
  .updateArtistName(artist)
}


//aggiunge di una la quantità
addQuantity(item: IRecordOnCart, index:number) {
  if(item.quantity != item.item.quantity){
    item.quantity++
    this.purchaseService.changeQuantityItem(index, item.quantity)
  this.updatePrice()

  }
}

//timuove una quantità
removeQuantity(item: IRecordOnCart, index:number) {
  if(item.quantity === 1){
   this.removeItem(index)
  } else {
    item.quantity--
    this.purchaseService.changeQuantityItem(index, item.quantity)
  this.updatePrice()

  }
}

removeItem(index:number) {
  this.cartItems.splice(index,1)
  this.updatePrice()
  this.purchaseService.removeItemOnCart(index)
}

updatePrice() {
  this.totalItemsPrice = 0
  this.cartItems.forEach((item)=> {
    this.totalItemsPrice = +this.totalItemsPrice + +item.item.price
   })
   if(this.totalItemsPrice >= 99) {
   this.totalOrderCost = +this.totalItemsPrice
   } else {
    this.shippingCost = 7
    this.totalOrderCost = +this.shippingCost + +this.totalItemsPrice
   }
}
}
