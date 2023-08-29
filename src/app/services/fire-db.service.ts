import { IUser } from './../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { firebaseConfig } from 'src/environments/firebase-config';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class FireDBService {
  fireKey: string = firebaseConfig.apiKey;
  urlUsers: string =
    'https://laika-records-default-rtdb.europe-west1.firebasedatabase.app/users';

  private authSubject = new BehaviorSubject<null | any>(null); //null = utente non loggato
  userData$ = this.authSubject.asObservable(); //dati utente loggato

  constructor(private http: HttpClient) {}

  //---------------------------[Inserimento dati utente]-------------------------
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
    return this.http
      .put(`${this.urlUsers}/${userId}.json?auth=${tokenId}`, userData)
  }


  //---------------------------[Prendo dati utente]-------------------------

  getUserData(userId: string, tokenId: string) {
    return this.http.get(`${this.urlUsers}/${userId}.json?auth=${tokenId}&print=pretty`)

  }



  //---------------------------[]-------------------------
}
// .pipe(
    //   tap((data) => {
    //     console.log('dati',data);

    //     this.authSubject.next(data); //invio lo user al subject
    //     localStorage.setItem('userData', JSON.stringify(data)); //salvo lo user per poterlo recuperare se si ricarica la pagina
    //   })
    // );;
