import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLinkActive } from '@angular/router';
import { FireDBService } from 'src/app/services/fire-db.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firedbService: FireDBService
  ) {
    this.form = this.fb.group(
      {
        name: this.fb.control(''),
        surname: this.fb.control(''),
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confPassword: this.fb.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      {
        Validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit() {}

  //---------------------------[Validazione password]-------------------------
  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      console.log('Passwords do not match');
      return { passwordNotMatch: true };
    }

    return null;
  }
  //--------------------------------------------

  submitForm() {
    if (this.form.valid) {
      this.isLoading = true;

      this.authService.signup(this.form.value).subscribe(
        (resData) => {
          //inserisco i dati utendi nel db
          this.firedbService
            .writeUserData(
              resData.localId,
              resData.idToken,
              this.form.value.email,
              this.form.value.name,
              this.form.value.surname
            )
            .subscribe((res) => {
              console.log(res);
              this.form.reset();
              this.isLoading = false;
              this.router.navigate(['/login']);
            });
        },
        (errorMessage) => {

          this.error = errorMessage;
          this.isLoading = false;
        }
      );
      this.form.reset();
    } else {
      this.error = 'Input not valid'
      this.form.reset();
      this.isLoading = false;
    }
  }
}
