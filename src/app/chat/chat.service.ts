import {Injectable} from '@angular/core';
import {User, UsersService} from '../users/users.service';
import {Chat} from '../chats/service/chats.service';
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
  id?: any;
  text: string;
  date?: any;
  creatorId: number;
  partnerId: number;
  chatId: number;
}

@Injectable({providedIn: 'root'})
export class ChatService {

  subChat: Subject<Chat> = new Subject<Chat>();
  subChats: Subject<Chat[]> = new Subject<Chat[]>();
  subMessages: Subject<Message[]> = new Subject<Message[]>();

  chats: Chat[] = [];
  messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private socketService: SocketService,
    private usersService: UsersService
  ) {
    this.fetchChats();

    this.socketService.on('connection', socketId => {
      console.log(socketId);
    });

    this.socketService.on('newChatWithPartner', newChat => {
      if (!this.chats.includes(newChat)) {
        this.chats.unshift(newChat);
      }
    });

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
      });
  }

  fetchChat(id: number) {
    this.http.get<Chat>('http://localhost:3000/chats/' + id)
      .subscribe(chat => {
        this.subChat.next(chat);
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
      });
  }

  removeChat(chat: Chat) {
    this.http.delete(`http://localhost:3000/chats/${chat.id}`)
      .subscribe( response => {
        this.chats.splice(this.chats.indexOf(chat), 1);
        this.subMessages.next([]);
      });
  }

  fetchMessages(chat: Chat) {
    const requestParam = {
      params: new HttpParams().set('chatId', chat.id.toString())
    };
    this.http.get<Message[]>('http://localhost:3000/messages', requestParam)
      .subscribe(messages => {
        this.messages = messages;
        this.subMessages.next(this.messages);
      });
  }

  sendMessage(message: Message) {
    this.messages.push(message);
    this.socketService.emit('message', message);
  }

  // setChatWithUser(user: User) {
  //   const chat = this.chats.find(ch => (ch.partnerId === user.id));
  //   if (chat) {
  //     this.subChat.next(chat);
  //   }
  //
  //   const newChat = {
  //     userId: this.profileService.get('id'),
  //     partnerId: user.id
  //   };
  //   this.http.post<Chat>('http://localhost:3000/chats', newChat)
  //     .subscribe(responseChat => {
  //       this.subChat.next(responseChat);
  //     });
  // }

}
