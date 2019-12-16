import {Injectable} from '@angular/core';
import {User, UsersService} from '../users/users.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Subject} from 'rxjs';
import {ProfileService} from '../profile/service/profile.service';
import {SocketService} from '../services/socket.service';

export interface Chat {
  id?: number;
  userId: number;
  partnerId: number;
  partner?: User;
}

export interface Message {
  id?: number;
  text: string;
  date?: number;
  creatorId: number;
  partnerId: number;
  chatId: number;
}

@Injectable({providedIn: 'root'})
export class ChatService {

  /* Поток для информации о чате */
  subChat: Subject<Chat> = new Subject<Chat>();

  /* Поток для информации о списке чатов */
  subChats: Subject<Chat[]> = new Subject<Chat[]>();

  /* Поток для информации о сообщениях */
  subMessages: Subject<Message[]> = new Subject<Message[]>();

  chats: Chat[] = [];
  messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private socketService: SocketService
  ) {
    this.fetchChats();

    this.socketService.on('connection', socketId => {
      console.log(socketId);
    });

    /* С авторизованным пользователем начали новый чат */
    this.socketService.on('newChatWithPartner', newChat => {
      if (!this.chats.includes(newChat)) {
        this.chats.unshift(newChat);
      }
    });

    /* Пришло новое сообщение */
    this.socketService.on('message', message => {
      this.messages.push(message);
      this.subMessages.next(this.messages);
    });

  }

  fetchChats() {
    const paramRequest = {
      params: new HttpParams().set('userId', this.profileService.get('id'))
    };

    this.http.get<Chat[]>('http://localhost:3000/chats', paramRequest)
      .subscribe(chats => {
        this.chats = chats;
        this.subChats.next(this.chats);
      }, err => {
        console.error('Error: ', err.error);
      });
  }

  createChat(user: User) {
    const newChat = {
      creatorId: this.profileService.get('id'),
      partnerId: user.id
    };
    this.http.post<Chat>('http://localhost:3000/chats', newChat)
      .subscribe(chat => {
        this.chats.unshift(chat);
        this.subChat.next(chat);
      }, err => {
        console.log('Error: ', err.error);
      });
  }

  removeChat(chat: Chat) {
    this.http.delete(`http://localhost:3000/chats/${chat.id}`)
      .subscribe(response => {
        this.chats.splice(this.chats.indexOf(chat), 1);
        this.subMessages.next([]);
      }, err => {
        console.log('Error: ', err.error);
      });
  }

  fetchMessages(chat: Chat): Promise<any> {
    return new Promise((resolve, reject) => {

      const requestParam = {
        params: new HttpParams().set('chatId', chat.id.toString())
      };

      this.http.get<Message[]>('http://localhost:3000/messages', requestParam)
        .subscribe(messages => {
          this.messages = messages;
          this.subMessages.next(this.messages);
          resolve();
        }, err => {
          reject(err);
        });

    });
  }

  sendMessage(message: Message) {
    this.messages.push(message);
    this.socketService.emit('message', message);
  }

}
