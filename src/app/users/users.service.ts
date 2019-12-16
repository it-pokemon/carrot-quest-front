import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Subject} from 'rxjs';
import {ProfileService} from '../profile/service/profile.service';
import {SocketService} from '../services/socket.service';

export interface User {
  id: number;
  username: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /* Поток для информации о пользоватлях */
  subUsers: Subject<User[]> = new Subject<User[]>();

  /* Поток для инофрмации о пользователе */
  subUser: Subject<User> = new Subject<User>();

  users: User[] = [];

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private socketService: SocketService
  ) {
    this.fetchUsers();

    this.socketService.on('newUser', newUser => {
      if (!this.users.find(u => (u.id === newUser.id))) {
        this.users.push(newUser);
        this.subUsers.next(this.users);
      }
    });
  }

  fetchUsers() {
    const requestParam = {
      params: new HttpParams().set('userId', this.profileService.get('id'))
    };
    this.http.get<User[]>('http://localhost:3000/users', requestParam)
      .subscribe(users => {
        this.users = users;
        this.subUsers.next(this.users);
      }, err => {
        console.error('Error: ', err.error);
      });
  }

  setChatWithUser(user: User) {
    this.subUser.next(user);
  }

}
