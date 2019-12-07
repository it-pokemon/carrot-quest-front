import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User, UsersService} from '../users/users.service';
import {Chat, ChatService, Message} from './chat.service';
import {Profile, ProfileService} from '../profile/service/profile.service';
import {NgScrollbar} from 'ngx-scrollbar-v8';
import set = Reflect.set;


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messagesScrollbar', {static: false}) scrollRef: NgScrollbar;

  subChat: any;
  subChats: any;
  subMessages: any;
  subUser: any;

  chats: Chat[];
  messages: Message[];

  partner: User | null = null;

  profile: Profile;

  activeChatId: number;

  loading = false;

  textMessage = '';

  constructor(
    private userService: UsersService,
    private chatService: ChatService,
    private profileService: ProfileService
  ) {
  }

  ngOnInit() {
    this.profile = this.profileService.get();

    this.subChats = this.chatService.subChats
      .subscribe(chats => {
        this.chats = chats;
      });

    this.subUser = this.userService.subUser
      .subscribe(partner => {
        const chat = this.chats.find(ch => (ch.partnerId === partner.id));
        if (chat === undefined) {
          this.chatService.createChat(partner);
        } else {
          this.chatService.subChat.next(chat);
        }
      });

    this.subChat = this.chatService.subChat
      .subscribe(chat => {
        this.setChatActive(chat);
      });

    this.subMessages = this.chatService.subMessages
      .subscribe(messages => {
        this.messages = messages;
        setTimeout(() => {
          this.scrollRef.scrollToBottom().subscribe(() => {
            this.loading = false;
          });
        }, 1000);
      });

  }

  ngOnDestroy() {
    this.subChats.unsubscribe();
    this.subMessages.unsubscribe();
    this.subUser.unsubscribe();
  }

  setChatActive(chat: Chat) {
    this.loading = true;
    this.partner = chat.partner;
    this.chatService.fetchMessages(chat);
    this.activeChatId = chat.id;
    setInterval(() => {
      this.loading = false;
    }, 1000);
  }

  removeChat(chat: Chat, event) {
    event.stopPropagation();
    this.chatService.removeChat(chat);
    this.partner = null;
    this.activeChatId = 0;
  }

  sendMessage() {
    const newMessage: Message = {
      text: this.textMessage,
      creatorId: this.profile.id,
      partnerId: this.partner.id,
      chatId: this.activeChatId
    };
    this.chatService.sendMessage(newMessage);
    this.textMessage = '';
  }

  getAvatarStyle(user: User) {
    return {
      background: 'url(' + user.avatar + ')',
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    };
  }
}
