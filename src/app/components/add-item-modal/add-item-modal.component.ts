import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  @Input() recordInfo!: IRecordInfo;
  @ViewChild('form') form!: NgForm;

  constructor(private fireBaseService: FireDBService) {}

  //prende le immagini caricate
  onFilesSelected(event: any) {
    const files: FileList = event.target.files; // Ottieni tutti i file selezionati

    for (let i = 0; i < files.length; i++) {
      // Aggiungi i file alla lista dei file selezionati
      this.imgFiles.push(files[i]);
    }
  }

  //invio dati item per inserimento nel database
  submitItem(form: NgForm) {
    if (this.imgFiles.length > 0) {
      //immagine caricata

    }

    //modello record
    const record = new Record(
      this.recordInfo.id,
      form.form.value.price,
      form.form.value.year,
      this.recordInfo.artists,
      this.recordInfo.artists_sort,
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
      this.recordInfo.extraartists
    );

    console.log(record);

    this.fireBaseService.additemintoDB(record).subscribe((res) => {
      console.log(res);
    });
    form.reset();
  }
}
