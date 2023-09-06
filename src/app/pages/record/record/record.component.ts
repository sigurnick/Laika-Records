import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent {
id!:string
genre!:string
record!:IRecordOnDatabase

constructor(private actRouter: ActivatedRoute, private firebaseService: FireDBService) {}

  ngOnInit() {


      //prendo l'id parametro
      this.actRouter.paramMap.subscribe((params) => {
        this.id = params.get('id')!;
        this.genre = params.get('genre')!
        console.log(this.genre, this.id);
      });

       //prendo i dati del record
       this.firebaseService.getItemByIdAndGenre(this.id, this.genre).subscribe((record)=> {
        this.record = record;
        console.log(this.record);

       })



  }

}
