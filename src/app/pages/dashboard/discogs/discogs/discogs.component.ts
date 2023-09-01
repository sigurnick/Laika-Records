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
  @ViewChild('searchDiscogsForm') searchDiscogsForm!: NgForm;
  barcode!: string;
  modalIsOpen: boolean = false;
  searchResult: Result[] = [];
  recordInfo!: IRecordInfo;
  selectedOption: string = '';
  constructor(private discogsService: DiscogsService) {}

  ngOnInit() {}

  //ricerca album in discogs tramite barcode o catno
  searchRecords(form: NgForm) {
    if (this.selectedOption === 'barcode') {
      //ricerca tramite barcode
      this.barcode = form.value.type;

      this.discogsService
        .getRecordsByBarcode(this.barcode)
        .subscribe((resData) => {
          this.searchResult = resData.results;
          form.reset();

          //prendo solo i risultati con il barcode corretto
          this.searchResult = this.searchResult.filter((item) => {
            return item.barcode[0] === this.barcode;
          });
          console.log(this.searchResult);
        });
    } else if (this.selectedOption === 'catno') {
      //ricerca tramite catno
    }
  }

  //ricerca album in discogs tramite artista e titolo
  searchRecordsByTitle(form: NgForm) {
    this.discogsService.getRecordsByTitle(form.value.artist, form.value.title).subscribe((resData) => {
      console.log(resData.results);
      this.searchResult = resData.results;

    })
  }

  //prendo info di un album specifico
  getRecordInfo(id: number) {
    this.discogsService.getRecordInfoById(id).subscribe((resData) => {
      this.recordInfo = resData;

      console.log(this.recordInfo);
    });
  }

  //aggiungi item al databse
  addToDatabase(id: number) {
    this.getRecordInfo(id);
    this.modalIsOpen = true;
  }
}
