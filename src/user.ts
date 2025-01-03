import { User as UserType } from '@smolpack/home-types';
import { HassCurrentUser } from './types/hass';
import Home from './home';

export default class User implements UserType {
  home: Home;
  hassUser: HassCurrentUser;

  constructor(home: Home, user: HassCurrentUser) {
    this.home = home;
    this.hassUser = user;
  }

  // Home

  get name(): string {
    return this.hassUser.name;
  }

  get uniqueIdentifier(): string {
    return this.hassUser.id;
  }
}
