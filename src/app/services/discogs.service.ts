import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { discogsConfig } from 'src/environments/discogs';
import { IBarcodeDiscogsRes } from '../interfaces/barcodeDiscogsRes';
import { IRecordInfo} from '../interfaces/record-id-res';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {

  //discogs key/url
  discogsKey: string = discogsConfig.api_key;
  discogsSecret: string = discogsConfig.api_secret;


  constructor(private http:HttpClient) { }

   //---------------------------[Gestione Discogs API]-------------------------

   getRecordsByBarcode(barcode: string) {
    return this.http.get<IBarcodeDiscogsRes>(`https://api.discogs.com/database/search?barcode=${barcode}&key=${this.discogsKey}&secret=${this.discogsSecret}`)
  }


  getRecordInfoById(id:number) {
   return this.http.get<IRecordInfo>(`https://api.discogs.com/releases/${id}`)
  }

  //------------------------------------------------------------------

}
