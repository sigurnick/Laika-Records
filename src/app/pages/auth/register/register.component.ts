import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false
  error:string = ''

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
      console.log('password non corrisponde');
      return { passwordNotMatch: true };
    }

    return null;
  }
  //--------------------------------------------


  submitForm() {
    if (this.form.valid) {
      this.isLoading = true
      console.log(this.form);

      this.authService.singup(this.form.value).subscribe(resData =>{
        console.log(resData);
        this.isLoading = false


      },
      errorMessage => {
        console.log('errore',errorMessage);
        this.error = errorMessage
        this.isLoading = false


      })

      this.form.reset()

    }
  }


}
