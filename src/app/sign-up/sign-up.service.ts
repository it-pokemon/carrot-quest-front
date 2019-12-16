import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  signUp(singUp: SignUp): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.post<Profile>('http://localhost:3000/sign-up', singUp)
        .subscribe(profile => {
          localStorage.setItem('profile', JSON.stringify(profile));
          this.router.navigate(['/']);
        }, err => {
          reject(err);
        });

    });
  }
}
