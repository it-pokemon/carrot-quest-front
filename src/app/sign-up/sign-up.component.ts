import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SignUp, SignUpService} from './sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit {

  form: FormGroup = new FormGroup(
    {
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    }
  );

  constructor(private signUpService: SignUpService) {
  }

  ngOnInit() {
  }

  signUp() {
    const signUp: SignUp = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };
    this.signUpService.signUp(signUp);
  }
}
