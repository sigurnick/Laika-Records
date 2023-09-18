import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  throwError,
  map,
  tap,
} from 'rxjs';
import { IRegister } from './interfaces/register';
import { IAuthResponseData } from './interfaces/auth-responde-data';
import { ILogin } from './interfaces/login';
import { environment } from 'src/environments/environment';





@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // apiKey= firebaseConfig.apiKey
  apiKey = environment.apiKeyFire
  singupUrl: string =
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  loginUrl: string =
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
  updateUrl: string =
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.apiKey}`;
    deleteUrl:string =
    `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${this.apiKey}`

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private authSubject = new BehaviorSubject<null | IAuthResponseData>(null); //null = utente non loggato
  user$ = this.authSubject.asObservable(); //dati utente loggato
  isLoggedIn$ = this.user$.pipe(map((user) => !!user)); //restituisce true o false se l'utente è loggato o meno
  autoLogoutTimer: any;



  constructor(private http: HttpClient, private router: Router) { this.restoreUser() }



  //----------------------SingUp]--------------------
  signup(data: IRegister) {
    data.returnSecureToken = true;
    return this.http
      .post<IAuthResponseData>(this.singupUrl, data)
      .pipe(
        catchError((errorRes) => {
          let errorMessage = "Error";
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }

          //casi di errore nella registrazione
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'Email already exists';
          }
          return throwError(errorMessage);
        }),
      );
  }
  //--------------------------------------------------------



  //-----------------------[Login]---------------------
  login(data: ILogin) {
    return this.http.post<IAuthResponseData>(this.loginUrl, data).pipe(

      tap(data => {

        this.authSubject.next(data);//invio lo user al subject
        localStorage.setItem('accessData', JSON.stringify(data));//salvo lo user per poterlo recuperare se si ricarica la pagina
      }),
      catchError(error => {
        return throwError(error)
      })

    )

  }
  //--------------------------------------------------

  //----------------------Update password------------------------
  updatePassword(userAuth: IAuthResponseData, newPassword: string) {

    const data = { "idToken": userAuth.idToken, "password": newPassword, "returnSecureToken": true }
    return this.http.post<any>(this.updateUrl, data)
  }

  //---------------------Delete account------------------------
  deleteAccount(userAuth: IAuthResponseData) {

 const data = { "idToken": userAuth.idToken}
    return this.http.post<any>(this.deleteUrl, data).pipe(
      tap(data => {
        this.authSubject.next(null);
        localStorage.removeItem('accessData');
        localStorage.removeItem('userData');
        localStorage.removeItem('userCart');
      }),
      catchError(error => {
        return throwError(error)
      })

    )

  }

  //-------------------------LogOut e AutoLogOut-------------------
  logout() {
    this.authSubject.next(null); //comunico al behaviorsubject che il valore da propagare è null
    localStorage.removeItem('accessData'); //elimino i dati salvati in localstorage
    this.router.navigate(['/login']); //redirect al login
  }

  //------------------------------------------------------------------

  //-----------------[Controllo al load della pagina]----------------
  //metodo che controlla al reload di pagina se l'utente è loggato e se il jwt è scaduto
  restoreUser() {
    const userJson: string | null = localStorage.getItem('accessData');//recupero i dati di accesso
    if (!userJson) return//se i dati non ci sono blocco la funzione

    const accessData: IAuthResponseData = JSON.parse(userJson);//se viene eseguita questa riga significa che i dati ci sono, quindi converto la stringa(che conteneva un json) in oggetto
    if (this.jwtHelper.isTokenExpired(accessData.idToken)) return //ora controllo se il token è scaduto, se lo è fermiamo la funzione

    //se nessun return viene eseguito proseguo
    this.authSubject.next(accessData);//invio i dati dell'utente al behaviorsubject
  }
}

