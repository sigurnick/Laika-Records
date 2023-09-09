import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { IRecordInfo } from 'src/app/interfaces/record-id-res';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { Record } from 'src/app/models/record.model';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss'],
})
export class AddItemModalComponent {
  recordToSendOnDatabase!: IRecordOnDatabase;
  imgFiles: File[] = [];
  imgFile!: File
  record!: IRecordOnDatabase;


  @Input() recordInfo!: IRecordInfo;
  @Input() barcode!: string;
  @Input() catno!: string;
  @ViewChild('form') form!: NgForm;

  constructor(private fireBaseService: FireDBService) {}

  //mette le immagini nella variabile imgFiles
  onFilesSelected(event: any) {

    let files: FileList = event.target.files; // Ottieni tutti i file selezionati
    for (let i = 0; i < files.length; i++) {

      this.imgFiles.push(files[i]); //file imagini
    }

  }


  //invio dati item per inserimento nel database
  submitItem(form: NgForm) {

    //modello record
    this.record = new Record(
      this.recordInfo.id,
      this.barcode,
      this.catno,
      form.value.price,
      this.recordInfo.year,
      this.recordInfo.artists,
      this.recordInfo.labels,
      this.recordInfo.series,
      this.recordInfo.formats,
      this.recordInfo.title,
      this.recordInfo.country,
      this.recordInfo.released,
      this.recordInfo.notes,
      this.recordInfo.released_formatted,
      this.recordInfo.videos,
      this.recordInfo.genres,
      this.recordInfo.styles,
      this.recordInfo.tracklist,
      this.recordInfo.extraartists,
      new Date(),
      1
    );
if(!this.record.price){return}
    console.log(this.record);

    //carico le immagini nello storage e ottengo le url
    this.fireBaseService.uploadImages(this.imgFiles, this.record).subscribe((urls)=>{
      this.record.imgUrl = urls //url delle immagini
      this.imgFiles = []

      //carico il record nel db
      this.record.genres.forEach((genre) => {
        this.fireBaseService
          .additemintoDB(this.record, genre)
          .subscribe((res) => {
            console.log('aggiunto:', res);
          });
      });
    })

    form.reset();
  }
}
