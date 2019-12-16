import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit, OnDestroy {

  /*
  * Переменная подписки информацию о пользователе, чтобы можно было отписаться,
  * когда компонент закончит жизненный цикл и не держать поток открытым.
  */
  subUsers: any;

  users: User[] = [];

  constructor(private userService: UsersService) {
  }

  ngOnInit() {
    this.subUsers = this.userService.subUsers
      .subscribe(users => {
        this.users = users;
      }, err => {
        console.error('Error: ', err.error);
      });
  }

  ngOnDestroy() {
    this.subUsers.unsubscribe();
  }

  setChatWithUser(user: User) {
    this.userService.setChatWithUser(user);
  }

}
