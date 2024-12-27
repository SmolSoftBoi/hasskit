import { Characteristic as CharacteristicType } from '@smolpack/home-types';
import { HassEntity } from 'home-assistant-js-websocket';
import Home from './home';

export default class Characteristic implements CharacteristicType {
  home: Home;
  hassState: HassEntity;

  constructor(home: Home, state: HassEntity) {
    this.home = home;
    this.hassState = state;
  }

  // Home

  get units(): string | void {
    return this.hassState.attributes.unit_of_measurement;
  }
}
