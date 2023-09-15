import { Component } from '@angular/core';
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
  selectedQuantity: number[] = []


  constructor(private purchaseService: PurchaseService, private sharedVariablesService: SharedVariablesService) {}

ngOnInit() {
 this.cartItems =  this.purchaseService.getCartItems()
 console.log('cart',this.cartItems);
 this.cartItems.forEach((item,index)=> {
  this.selectedQuantity[index] = item.quantity
 })

}

sendArtistName(artist:string) {
  this.sharedVariablesService
  .updateArtistName(artist)
}
}
