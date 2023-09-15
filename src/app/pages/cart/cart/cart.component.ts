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
  // selectedQuantity: number[] = []


  constructor(private purchaseService: PurchaseService, private sharedVariablesService: SharedVariablesService) {}

ngOnInit() {
  initFlowbite();
 this.cartItems =  this.purchaseService.getCartItems()
 console.log('cart',this.cartItems);
//  this.cartItems.forEach((item,index)=> {
//   this.selectedQuantity[index] = item.quantity
//  })

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
  }
}

//timuove una quantità
removeQuantity(item: IRecordOnCart, index:number) {
  if(item.quantity === 1){
   this.removeItem(index)
  } else {
    item.quantity--
    this.purchaseService.changeQuantityItem(index, item.quantity)
  }
}

removeItem(index:number) {
  this.cartItems.splice(index,1)
  this.purchaseService.removeItemOnCart(index)
}
}
