import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../users/users.service';
import {Profile} from '../profile/service/profile.service';
import {Router} from '@angular/router';

export interface SignUp {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  signUp(singUp: SignUp) {
    this.http.post<Profile>('http://localhost:3000/sign-up', singUp)
      .subscribe(profile => {
        localStorage.setItem('profile', JSON.stringify(profile));
        this.router.navigate(['/']);
      });
  }
}
