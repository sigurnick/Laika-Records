import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { IUser } from './../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs/internal/operators/tap';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import {  mergeMap } from 'rxjs';
import { Storage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { Auth } from '@angular/fire/auth';
import { getAuth, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';




@Injectable({
  providedIn: 'root',
})
export class FireDBService {
  //firebase key/url
  fireKey: string = environment.apiKeyFire;
  urlUsers: string =
    'https://laika-records-default-rtdb.europe-west1.firebasedatabase.app/users';
  urlItems: string = `https://laika-records-default-rtdb.europe-west1.firebasedatabase.app/items`;

  //variabili gestione utenti
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private authSubject = new BehaviorSubject<null | IUser>(null); //null = utente non loggato
  userData$ = this.authSubject.asObservable(); //dati utente loggato


  constructor(private http: HttpClient,
    private router: Router,
    private storage: Storage,
    private auth: Auth
    ) {
    this.restoreUser();
  }

  //---------------------------[Gestione Utenti]-------------------------

  //Inserimento dati utente
  writeUserData(
    userId: string,
    tokenId: string,
    email: string,
    name?: string,
    surname?: string
  ) {
    const userData = {
      userId: userId,
      name: name,
      surname: surname,
      email: email,
    };
    return this.http.put(
      `${this.urlUsers}/${userId}.json?auth=${tokenId}`,
      userData
    );
  }

//update password user //! Da sistemare
 updatePassword(newPassword: string) {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user);

  if(user){
    updatePassword(user, newPassword).then(() => {
     console.log('pass changed');

    }).catch((error) => {
      // An error ocurred
      // ...
    });
  }
 }

  //Prendo dati utente e li inserisco nel localstorage
  getUserData(userId: string, tokenId: string) {
    return this.http
      .get<IUser>(`${this.urlUsers}/${userId}.json?auth=${tokenId}`)
      .pipe(
        tap((data) => {
          this.authSubject.next(data); //invio lo user al subject
          localStorage.setItem('userData', JSON.stringify(data)); //salvo lo user per poterlo recuperare se si ricarica la pagina
        })
      );
  }

  //Prendo i dati dell'utende al lancio
  restoreUser() {
    const userJson: string | null = localStorage.getItem('userData'); //recupero i dati di accesso
    if (!userJson) return; //se i dati non ci sono blocco la funzione

    const userData: IUser = JSON.parse(userJson); //se viene eseguita questa riga significa che i dati ci sono, quindi converto la stringa(che conteneva un json) in oggetto

    this.authSubject.next(userData); //invio i dati dell'utente al behaviorsubject
  }

  //Rimuovi dati utente
  removeUserData() {
    this.authSubject.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/home']);
  }
  //------------------------------------------------------------------

  //---------------------------[Gestione Database Items]-------------------------
  //Inserimento item nel database
  additemintoDB(item: IRecordOnDatabase, genre: string) {
    //controllo genre contiene "/" e lo tolgo se c'è
    if (genre.includes('/')) {
      genre = genre.replace('/', '');
    }


    return this.http.get<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`)
    .pipe(
      mergeMap((resData) => {
        if (resData && resData.quantity) {
          // Oggetto già presente nel database quindi incremento la quantità
          resData.quantity++;
          return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`, resData);
        } else {
          // Oggetto non presente nel database quindi lo inserisco
          item.quantity = 1;
          return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`, item);
        }
      })
    );
  }

  getItemByIdAndGenre(id:string, genre:string) {
    return this.http.get<IRecordOnDatabase>(`${this.urlItems}/${genre}/${id}.json`)
  }

  //recupera tutti gli oggetti in vendita
  getAllItems() {
    return this.http.get<IRecordOnDatabase[]>(`${this.urlItems}.json`);
  }

  //aggiunge di uno la quantità di un oggetto nel database
  addQuantityToItem(item:IRecordOnDatabase, genre: string) {
    if (genre.includes('/')) {
      genre = genre.replace('/', '');
    }
    return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`,item);
  }

  //rimuove di uno la quantità di un oggetto nel database
  removeQuantityToItem(item:IRecordOnDatabase, genre: string) {
    if (genre.includes('/')) {
      genre = genre.replace('/', '');
    }

    return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`,item);
  }

  //elimina un oggetto dal database
  eliminateItem(item:IRecordOnDatabase, genre: string) {
    if (genre.includes('/')) {
      genre = genre.replace('/', '');
    }
    return this.http.delete<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`);
  }

  //salvataggio immagini nello storage
  saveImgInStorage(imgFile: File, item:IRecordOnDatabase) {

    const storage = getStorage(); //storage
    const storageRef = ref(storage, `IMG/LP/${item.id}/${imgFile.name}`); //percorrso salvataggio file

    const imagePath =`IMG/LP/${item.id}/${imgFile.name}`

    uploadBytes(storageRef, imgFile).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            item.img = imagePath
            //ora inserisco il percorso nel database
          this.http.put<IRecordOnDatabase>(`${this.urlItems}/${item.genres[0]}/${item.id}.json`,item).subscribe((data) => {

          })
          });
      // for (const selectedImage of imgFiles) {
      //   if (selectedImage) {
      //     const filePath = `images/${selectedImage.name}`;
      //     const fileRef =ref(storage, filePath);

      //     uploadBytes(storageRef, selectedImage).then((snapshot) => {
      //       console.log('Uploaded a blob or file!');
      //     });

      //   }
      // }
  }

  async getImage(item: IRecordOnDatabase): Promise<string | null> {
    if (item.img) {
      const storage = getStorage();

      try {
        const url = await getDownloadURL(ref(storage, item.img));
        // Ora puoi utilizzare l'URL come desideri
        console.log('URL dell\'immagine:', url);
        return url;
      } catch (error) {
        // Gestisci gli errori qui
        console.error('Errore nel recupero dell\'URL dell\'immagine:', error);
        return null; // Restituisci un valore di fallback in caso di errore
      }
    } else {
      return null; // Restituisci un valore di fallback se item.img non è definito
    }
  }



// getImage(item: IRecordOnDatabase){
//   if (item.img) {
//     const storage = getStorage();
// getDownloadURL(ref(storage, item.img))
//   .then((url) => {
//     // `url` is the download URL for 'images/stars.jpg'

//     // This can be downloaded directly:
//     const xhr = new XMLHttpRequest();
//     xhr.responseType = 'blob';
//     xhr.onload = (event) => {
//       const blob = xhr.response;
//     };
//     xhr.open('GET', url);
//     xhr.send();

//     // Or inserted into an <img> element
//     return url
//   })
//   .catch((error) => {
//     // Handle any errors
//   });
//   }

// }

  //------------------------------------------------------------------


}
