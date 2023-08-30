import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Result } from 'src/app/interfaces/barcodeDiscogsRes';
import { DiscogsService } from 'src/app/services/discogs.service';

@Component({
  selector: 'app-discogs',
  templateUrl: './discogs.component.html',
  styleUrls: ['./discogs.component.scss']
})
export class DiscogsComponent {
	@ViewChild('discogsSearchForm') discogsSearchForm!: NgForm
  barcode!:string
  searchResult:Result[] = []
  constructor(private discogsService: DiscogsService) { }

  searchRecords(form:NgForm) {


    this.barcode = form.value.barcode;

    this.discogsService.getRecordsByBarcode(this.barcode).subscribe((resData) => {
      this.searchResult = resData.results;
      console.log(this.searchResult);
    })


  }

}



