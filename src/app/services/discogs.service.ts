import { discogsConfig } from './../../environments/discogs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBarcodeDiscogsRes } from '../interfaces/barcodeDiscogsRes';
import { IRecordInfo} from '../interfaces/record-id-res';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {

  //discogs key/url


  // discogsKey: string = discogsConfig.api_key;
  // discogsSecret: string = discogsConfig.api_secret;
  discogsKey!: string
  discogsSecret!: string


  constructor(private http:HttpClient) {
  }

   //---------------------------[Gestione Discogs API]-------------------------

   //cerca album con barcode
   getRecordsByBarcode(barcode: string) {
    return this.http.get<IBarcodeDiscogsRes>(`https://api.discogs.com/database/search?barcode=${barcode}&key=${this.discogsKey}&secret=${this.discogsSecret}`)
  }

   //cerca album con catno
   getRecordsByCatno(catno: string) {
    return this.http.get<IBarcodeDiscogsRes>(`https://api.discogs.com/database/search?barcode=${catno}&key=${this.discogsKey}&secret=${this.discogsSecret}`)
  }

   //cerca album con titole e artista
   getRecordsByTitle(artist:string, title: string) {
    return this.http.get<IBarcodeDiscogsRes>(`https://api.discogs.com/database/search?artist=${artist}&title=${title}&format=vinyl&key=${this.discogsKey}&secret=${this.discogsSecret}`)
  }


  //prende le info di uno specifico album

  getRecordInfoById(id:number) {
   return this.http.get<IRecordInfo>(`https://api.discogs.com/releases/${id}`)
  }

  //------------------------------------------------------------------

}
