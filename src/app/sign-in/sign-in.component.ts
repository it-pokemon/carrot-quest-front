import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SignIn, SignInService} from './sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less']
})
export class SignInComponent implements OnInit {

  form: FormGroup = new FormGroup(
    {
      email: new FormControl(''),
      password: new FormControl('')
    }
  );

  constructor(private signInService: SignInService) {
  }

  ngOnInit() {
  }

  signIn() {
    const signIn: SignIn = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };
    this.signInService.signIn(signIn);
  }
}
