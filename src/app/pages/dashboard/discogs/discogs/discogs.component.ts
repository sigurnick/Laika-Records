import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Result } from 'src/app/interfaces/barcodeDiscogsRes';
import { IRecordInfo } from 'src/app/interfaces/record-id-res';
import { DiscogsService } from 'src/app/services/discogs.service';

@Component({
  selector: 'app-discogs',
  templateUrl: './discogs.component.html',
  styleUrls: ['./discogs.component.scss'],
})
export class DiscogsComponent {
  @ViewChild('discogsSearchForm') discogsSearchForm!: NgForm;
  barcode!: string;
  modalIsOpen: boolean = false;
  searchResult: Result[] = [];
  recordInfo!: IRecordInfo;
  constructor(private discogsService: DiscogsService) {}

  ngOnInit() {}

  //ricerca tramite barcode
  searchRecords(form: NgForm) {
    this.barcode = form.value.barcode;

    this.discogsService
      .getRecordsByBarcode(this.barcode)
      .subscribe((resData) => {
        this.searchResult = resData.results;

        //prendo solo i risultati con il barcode corretto
        this.searchResult = this.searchResult.filter((item) => {
          return item.barcode[0] === this.barcode;
        });
        console.log(this.searchResult);
      });
  }

  //prendo info di un album specifico
  getRecordInfo(id: number) {
    this.discogsService.getRecordInfoById(id).subscribe((resData) => {
      this.recordInfo = resData;

      console.log(this.recordInfo);
    });
  }

  //aggiungi item al databse
  addToDatabase(id:number) {
this.getRecordInfo(id)
this.modalIsOpen = true
  }
}
