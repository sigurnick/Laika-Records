import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { FireDBService } from 'src/app/services/fire-db.service';
import { AuthService } from '../../auth/auth.service';
import { IUser } from 'src/app/interfaces/user';
import { IAuthResponseData } from '../../auth/interfaces/auth-responde-data';


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
  userAuth!: IAuthResponseData | null
  isWantedRecord: boolean = false
  isColectedRecord: boolean = false
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

      //prendo dati utente
      this.firebaseService.userData$.subscribe((user) => {
        this.userData = user;

        //prendo dati auth utente
        this.authService.user$.subscribe((userAuth) => {
          this.userAuth = userAuth;

          if (this.userAuth && this.userData) {
            //controllo se il record è nella wanted dello user
            this.firebaseService.getWantedById(this.userData, this.userAuth, this.record).subscribe((wanted) => {
              if (wanted){
                this.isWantedRecord = true
              }
              //controllo se il record è nella collection dello user
              this.firebaseService.getCollectedById(this.userData!, this.userAuth!, this.record).subscribe((collected)=>{
                if (collected){
                  this.isColectedRecord = true
                }
              })

            })
          }
        })

      })
    })


  }

  //cambia immagine principale
  changePreview(url: string) {
    this.currentPreviewImg = url
  }

  //salvo record nella wanted list
  addRecordToWantedList() {
    this.isWantedRecord = true
    this.firebaseService.addRecordWanted(this.userData!, this.userAuth!, this.record).subscribe((data) => {
      console.log(data);

      if (data) {
        //aumento il contatore wanted del record
        this.record.wanted++
        this.record.genres.forEach((genre) => {
          this.firebaseService.updateRecord(this.record, genre).subscribe((data) => {
            console.log(data);

          })
        })
      }

    })
  }

  //rimuovo record dalla wanted list
  removeRecordFromWantedList() {
    this.isWantedRecord = false
    this.firebaseService.removeRecordWanted(this.userData!, this.userAuth!, this.record).subscribe((data) => {


        //diminuisco il contatore wanted del record
        if(this.record.wanted!=0) {
          this.record.wanted--
        }
        this.record.genres.forEach((genre) => {
          this.firebaseService.updateRecord(this.record, genre).subscribe((data) => {
            console.log(data);

          })
        })


    })
  }







  //salvo record nella collection list
  addRecordToCollectionList() {
    this.isColectedRecord = true
    this.firebaseService.addRecordCollected(this.userData!, this.userAuth!, this.record).subscribe((data) => {
      console.log(data);

      if (data) {
        //aumento il contatore collected del record
        this.record.collected++
        this.record.genres.forEach((genre) => {
          this.firebaseService.updateRecord(this.record, genre).subscribe((data) => {
            console.log(data);

          })
        })
      }

    })
  }

  //rimuovo record dalla collection list
  removeRecordFromCollectionList() {
    this.isColectedRecord = false
    this.firebaseService.removeRecordCollected(this.userData!, this.userAuth!, this.record).subscribe((data) => {


        //diminuisco il contatore collected del record
        if(this.record.collected!=0) {
          this.record.collected--
        }
        this.record.genres.forEach((genre) => {
          this.firebaseService.updateRecord(this.record, genre).subscribe((data) => {
            console.log(data);

          })
        })


    })
  }
}
