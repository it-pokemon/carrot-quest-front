import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignUp, SignUpService} from './sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit {

  @ViewChild('formError', {static: true}) formError: ElementRef;

  form: FormGroup = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    }
  );

  constructor(private signUpService: SignUpService) {
  }

  ngOnInit() {
  }

  signUp() {
    if (!this.form.valid) {
      return;
    }

    const signUp: SignUp = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };

    this.signUpService.signUp(signUp)
      .catch(err => {
        this.formError.nativeElement.textContent = err.error;
      });
  }
}
