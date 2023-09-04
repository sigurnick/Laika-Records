import { IRecordOnDatabase } from 'src/app/interfaces/recordOnDatabase';
import { IRecordInfo } from 'src/app/interfaces/record-id-res';
import { IUser } from './../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs/internal/operators/tap';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Storage } from '@angular/fire/storage';
import { Observable, catchError, map, mergeMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FireDBService {
  //firebase key/url
  fireKey: string = environment.apiKey;
  urlUsers: string =
    'https://laika-records-default-rtdb.europe-west1.firebasedatabase.app/users';
  urlItems: string = `https://laika-records-default-rtdb.europe-west1.firebasedatabase.app/items`;

  //variabili gestione utenti
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private authSubject = new BehaviorSubject<null | IUser>(null); //null = utente non loggato
  userData$ = this.authSubject.asObservable(); //dati utente loggato

  // private storage: Storage = inject(Storage);
  constructor(private http: HttpClient, private router: Router) {
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

  //Prendo dati utente
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

  //recupera tutti gli oggetti in vendita
  getAllItems() {
    return this.http.get<IRecordOnDatabase[]>(`${this.urlItems}.json`);
  }

  //aggiunge di uno la quantità di un oggetto nel database
  addQuantityToItem(item:IRecordOnDatabase, genre: string) {

    return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`,item);
  }

  //rimuove di uno la quantità di un oggetto nel database
  removeQuantityToItem(item:IRecordOnDatabase, genre: string) {

    return this.http.put<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`,item);
  }

  //elimina un oggetto dal database
  eliminateItem(item:IRecordOnDatabase, genre: string) {

    return this.http.delete<IRecordOnDatabase>(`${this.urlItems}/${genre}/${item.id}.json`);
  }
  //------------------------------------------------------------------

  // async uploadFiles(files: File[]) {
  //   for (const file of files) {
  //     const filePath = `path_del_tuo_file/${file.name}`;
  //     const storageRef = this.storage.ref(filePath);

  //     try {
  //       await storageRef.put(file);
  //       console.log(`File ${file.name} caricato con successo.`);
  //     } catch (error) {
  //       console.error(`Errore durante il caricamento del file ${file.name}:`, error);
  //     }
  //   }
  // }
}
