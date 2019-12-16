import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignIn, SignInService} from './sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less']
})
export class SignInComponent implements OnInit {

  @ViewChild('formError', {static: true}) formError: ElementRef;

  form: FormGroup = new FormGroup(
    {
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

  constructor(private signInService: SignInService) {
  }

  ngOnInit() {
  }

  signIn() {
    if (!this.form.valid) {
      return;
    }

    const signIn: SignIn = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };

    this.signInService.signIn(signIn)
      .catch(err => {
        this.formError.nativeElement.textContent = err.error;
      });
  }
}
