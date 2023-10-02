
import { Component, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Result } from 'src/app/interfaces/barcodeDiscogsRes';
import { IRecordInfo } from 'src/app/interfaces/record-id-res';
import { DiscogsService } from 'src/app/services/discogs.service';
import { Storage } from '@angular/fire/storage';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
@Component({
  selector: 'app-discogs',
  templateUrl: './discogs.component.html',
  styleUrls: ['./discogs.component.scss'],
})
export class DiscogsComponent {
  @ViewChild('searchDiscogsForm') searchDiscogsForm!: NgForm;
  barcode!: string;
  catno!: string;
  modalIsOpen: boolean = false;
  searchResult: Result[] = [];
  recordInfo!: IRecordInfo;
  selectedOption: string = '';

  itemAddedToDb: IRecordOnDatabase | null = null
  showItemAddedToDb: boolean = false



  constructor(private discogsService: DiscogsService, private storage: Storage, private sharedVariablesService: SharedVariablesService) {}

  ngOnInit() {
    this.sharedVariablesService.getItemAddedEvent().subscribe((resData)=> {
      this.itemAddedToDb = resData
      if(this.itemAddedToDb != null ) {
        this,this.showItemAddedToDb = true
        setTimeout(()=> {
         this.showItemAddedToDb = false
        },3000)
      }
    })
  }

  //---------------------------[ricerca album in discogs tramite barcode o catno]-------------------------
  searchRecords(form: NgForm) {
    if (this.selectedOption === 'barcode') {
      //ricerca tramite barcode
      const barcode = form.value.type;

      this.discogsService.getRecordsByBarcode(barcode).subscribe((resData) => {
        this.searchResult = resData.results;
        form.reset();

        //prendo solo i risultati con il barcode corretto
        this.searchResult = this.searchResult.filter((item) => {
          return item.barcode[0] === barcode;
        });
        console.log(this.searchResult);
      });
    } else if (this.selectedOption === 'catno') {
      //ricerca tramite catno
      const catno = form.value.type;

      this.discogsService.getRecordsByCatno(catno).subscribe((resData) => {
        this.searchResult = resData.results;
        console.log(this.searchResult);
      });
    }
  }
  //------------------------------------------------------------------

  //---------------------------[ricerca album in discogs tramite artista e titolo]-------------------------
  searchRecordsByTitle(form: NgForm) {
    this.discogsService
      .getRecordsByTitle(form.value.artist, form.value.title)
      .subscribe((resData) => {
        console.log(resData.results);
        this.searchResult = resData.results;

      });
  }
  //------------------------------------------------------------------

  //prendo info di un album specifico
  getRecordInfo(id: number) {
    console.log('id:',id);

    this.discogsService.getRecordInfoById(id).subscribe((resData) => {
      this.recordInfo = resData;

      console.log('title:',this.recordInfo.title);
      console.log('artist:',this.recordInfo.artists[0].name);

    });
  }

  //aggiungi item al databse
  addToDatabase(id: number, barcode: string, catno: string) {
    this.barcode = barcode;
    this.catno = catno;
    this.getRecordInfo(id);
    this.modalIsOpen = true;


  }
}
