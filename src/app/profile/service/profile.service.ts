import {Injectable} from '@angular/core';

export interface Profile {
  id: number;
  username: string;
  avatar: string;
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile: Profile;

  constructor() {
    const profile = localStorage.getItem('profile');
    if (profile) {
      this.profile = JSON.parse(profile);
    }
  }

  get(query?: string): any {
    if (query) {
      return this.profile[query];
    }
    return this.profile;
  }
}
