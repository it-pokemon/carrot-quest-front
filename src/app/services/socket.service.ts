import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {ProfileService} from '../profile/service/profile.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {

  userId: number;

  constructor(private profileService: ProfileService) {
    super({
      url: 'http://localhost:3000?userId=' + profileService.get('id'), options: {forceNew: false}
    });
  }
}
