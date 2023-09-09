import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { FireDBService } from 'src/app/services/fire-db.service';
import { AuthService } from '../../auth/auth.service';
import { IUser } from 'src/app/interfaces/user';


@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent {
  id!: string
  genre!: string
  record!: IRecordOnDatabase
  imgSecondary: string[] = []
  currentPreviewImg!: string
  userData!: IUser | null
  constructor(private actRouter: ActivatedRoute, private firebaseService: FireDBService, private authService: AuthService) {
    initFlowbite();
  }

  ngOnInit() {


    //prendo l'id parametro
    this.actRouter.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
      this.genre = params.get('genre')!
    });

    //prendo i dati del record
    this.firebaseService.getItemByIdAndGenre(this.id, this.genre).subscribe((record) => {
      this.record = record;

      if (this.record.imgUrl) {
        //imposto la immagine iniziale
        this.currentPreviewImg = this.record.imgUrl[0]

        //prendo le imagini dell' album tranne la prima
        if (this.record.imgUrl.length > 1) {
          this.imgSecondary = this.record.imgUrl.slice(1)
        }
      }
    })
    //prendo dati utente
    this.firebaseService.userData$.subscribe((user) => {
      this.userData = user;
    })

  }

  //cambia immagine principale
  changePreview(url: string) {
    this.currentPreviewImg = url
  }

  //rediret dello user al login
  redirectToLogin() {

  }
}
