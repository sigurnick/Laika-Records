import { IAuthResponseData } from 'src/app/pages/auth/interfaces/auth-responde-data';
import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { IUser } from './../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs/internal/operators/tap';
import { Router } from '@angular/router';
import { Observable, forkJoin, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getAuth, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';




@Injectable({
  providedIn: 'root',
})
export class FireDBService {
  //firebase key/url
  fireKey: string = environment.firebaseConfig.apiKey;
  urlUsers: string =
    'https://laika-records-default-rtdb.europe-west1.firebasedatabase.app/users';
  urlItems: string = `https://laika-records-default-rtdb.europe-west1.firebasedatabase.app/items`;

  //variabili gestione utenti
  private authSubject = new BehaviorSubject<null | IUser>(null); //null = utente non loggato
  userData$ = this.authSubject.asObservable(); //dati utente loggato




  constructor(private http: HttpClient,
    private router: Router,

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

  //update password user
  updatePassword(newPassword: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);

    if (user) {
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


  //-------[Gestione wanted utente]--------
  //inserisci item wanted in user
  addRecordWanted(userData: IUser, userAuth:IAuthResponseData, record:IRecordOnDatabase) {

    return this.http.put(
      `${this.urlUsers}/${userData.userId}/wanted/${record.id}.json?auth=${userAuth.idToken}`,
      record
    );
  }

  //rimuovo item wanted in user
  removeRecordWanted(userData: IUser, userAuth:IAuthResponseData, record:IRecordOnDatabase) {
    return this.http.delete(
      `${this.urlUsers}/${userData.userId}/wanted/${record.id}.json?auth=${userAuth.idToken}`
    );
  }

  //cerco se il record è nella wanted dello user
  getWantedById(userData: IUser, userAuth:IAuthResponseData, item:IRecordOnDatabase) {
    return this.http.get<IRecordOnDatabase[]>(
      `${this.urlUsers}/${userData.userId}/wanted/${item.id}.json?auth=${userAuth.idToken}`);
  }

 //prendo lista wanted user
 getUserWanted(userData: IUser, userAuth:IAuthResponseData) {
  return this.http.get<IRecordOnDatabase[]>(
    `${this.urlUsers}/${userData.userId}/wanted.json?auth=${userAuth.idToken}`);
}



  //-------[Gestione collection utente]--------

  //inserisci item wanted in user
  addRecordCollected(userData: IUser, userAuth:IAuthResponseData, record:IRecordOnDatabase) {

    return this.http.put(
      `${this.urlUsers}/${userData.userId}/collection/${record.id}.json?auth=${userAuth.idToken}`,
      record
    );
  }

  //rimuovo item wanted in user
  removeRecordCollected(userData: IUser, userAuth:IAuthResponseData, record:IRecordOnDatabase) {
    return this.http.delete(
      `${this.urlUsers}/${userData.userId}/collection/${record.id}.json?auth=${userAuth.idToken}`
    );
  }



   //cerco se il record è nella collection dello user
   getCollectedById(userData: IUser, userAuth:IAuthResponseData, item:IRecordOnDatabase) {

    return this.http.get<IRecordOnDatabase[]>(
      `${this.urlUsers}/${userData.userId}/collection/${item.id}.json?auth=${userAuth.idToken}`);
  }

    //prendo lista collection user
    getUserCollection(userData: IUser, userAuth:IAuthResponseData) {
      return this.http.get<IRecordOnDatabase[]>(
        `${this.urlUsers}/${userData.userId}/collection.json?auth=${userAuth.idToken}`);
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
  //prendo informazioni record con id e genere
  getItemByIdAndGenre(id: string, genre: string) {
    return this.http.get<IRecordOnDatabase>(`${this.urlItems}/${genre}/${id}.json`)
  }

  //recupera tutti gli oggetti in vendita
  getAllItems() {
    return this.http.get<IRecordOnDatabase[]>(`${this.urlItems}.json`);
  }

  //aggiunge di uno la quantità di un oggetto nel database
  addQuantityToItem(item: IRecordOnDatabase, genre: string) {
    if (genre.includes('/')) {
      genre = genre.replace('/', '');
    }
    return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`, item);
  }

  //rimuove di uno la quantità di un oggetto nel database
  removeQuantityToItem(item: IRecordOnDatabase, genre: string) {
    if (genre.includes('/')) {
      genre = genre.replace('/', '');
    }

    return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`, item);
  }

  //elimina un oggetto dal database
  eliminateItem(item: IRecordOnDatabase, genre: string) {
    if (genre.includes('/')) {
      genre = genre.replace('/', '');
    }
    return this.http.delete<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`);
  }

 //modifica la quantità di un oggetto nel database
 updateItemQuantity(item: IRecordOnDatabase, newQuantity: number, genre:string) {
  item.quantity = newQuantity;

  return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`, item);
 }


  //salva un array di immagini nello storage e ritorna le url
   uploadImages(files: File[], item: IRecordOnDatabase): Observable<string[]> {
    const storage = getStorage();
    const storageRef = ref(storage, `IMG/LP/${item.id}`);

    const observables = files.map((file) => {
      const filePath = `${storageRef}/${file.name}`;
      const fileStorageRef = ref(storage, filePath);

      return new Observable<string>((observer) => {
        uploadBytes(fileStorageRef, file)
          .then((snapshot) => {
            console.log('Uploaded a blob or file:', file.name);

            getDownloadURL(fileStorageRef).then((url) => {
              observer.next(url);
              observer.complete();
            });
          })
          .catch((error) => {
            observer.error(error);
          });
      });
    });

    // Utilizza forkJoin per combinare tutti gli Observable in uno
    return forkJoin(observables);
  }


  //----------Filtri Items--------
  getItemsByGenre(genre: string) {
    return  this.http.get<IRecordOnDatabase>(`${this.urlItems}/${genre}.json`)
  }



  //-----------[Wanted e Collection]-----------

  //update record data
  updateRecord(item:IRecordOnDatabase, genre:string) {
    return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`, item);
  }

search(text:string) {

}
  //------------------------------------------------------------------


}
