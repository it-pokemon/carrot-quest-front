import {Injectable} from '@angular/core';
import {Profile} from '../profile/service/profile.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

export interface SignIn {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  signIn(signIn: SignIn): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.post<Profile>('http://localhost:3000/sign-in', signIn)
        .subscribe(profile => {
          localStorage.setItem('profile', JSON.stringify(profile));
          this.router.navigate(['/']);
        }, err => {
          reject(err);
        });

    });
  }

  isAuth(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (localStorage.getItem('profile')) {
        resolve(true);
      }
      resolve(false);
    });
  }
}
