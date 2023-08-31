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
import { firebaseConfig } from 'src/environments/firebase-config';




@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // apiKey= firebaseConfig.apiKey
    apiKey= environment.apiKey
  singupUrl: string =
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  loginUrl: string =
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private authSubject = new BehaviorSubject<null | IAuthResponseData>(null); //null = utente non loggato
  user$ = this.authSubject.asObservable(); //dati utente loggato
  isLoggedIn$ = this.user$.pipe(map((user) => !!user)); //restituisce true o false se l'utente è loggato o meno
  autoLogoutTimer: any;



  constructor(private http: HttpClient, private router: Router) { this.restoreUser()}



  //----------------------SingUp]--------------------
  singup(data: IRegister) {
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


        this.autoLogout(+data.expiresIn);//un metodo per il logout automatico
      })
    )

  }
  //--------------------------------------------------

  // private handleAuthentication(
  //   email: string,
  //   userId: string,
  //   token: string,
  //   expiresIn: number
  // )

  // {
  //   const expirationDate = new Date(
  //     new Date().getTime() + expiresIn * 1000
  //   );
  //   const user = new User(
  //     email,
  //     userId,
  //     token,
  //     expirationDate

  //   );
  // };

  //-------------------------LogOut e AutoLogOut-------------------
  logout() {
    this.authSubject.next(null); //comunico al behaviorsubject che il valore da propagare è null
    localStorage.removeItem('accessData'); //elimino i dati salvati in localstorage
    this.router.navigate(['/login']); //redirect al login
  }


  //---------------------------------------------
  autoLogout(expDate: number) {
    expDate = expDate * 1000; //converto in millisecondi
    this.autoLogoutTimer = setTimeout(() => {
      //avvio un timer che fa logout allo scadere del tempo
      console.log('effettuo logout');
      this.logout();
    }, expDate);
  }
  //------------------------------------------------------------------

   //-----------------[Controllo al load della pagina]----------------
  //metodo che controlla al reload di pagina se l'utente è loggato e se il jwt è scaduto
  restoreUser(){
    const userJson:string|null = localStorage.getItem('accessData');//recupero i dati di accesso
    if(!userJson) return//se i dati non ci sono blocco la funzione

    const accessData:IAuthResponseData = JSON.parse(userJson);//se viene eseguita questa riga significa che i dati ci sono, quindi converto la stringa(che conteneva un json) in oggetto
    if(this.jwtHelper.isTokenExpired(accessData.idToken)) return //ora controllo se il token è scaduto, se lo è fermiamo la funzione

    //se nessun return viene eseguito proseguo
    this.authSubject.next(accessData);//invio i dati dell'utente al behaviorsubject
}
}
function getDatabase() {
  throw new Error('Function not implemented.');
}

function ref(db: void, arg1: string): any {
  throw new Error('Function not implemented.');
}

