import { Characteristic } from '@smolpack/home-types';
import { HassEntity } from 'home-assistant-js-websocket';
import Home from './home';

export default class State implements Characteristic {
  home: Home;
  hassState: HassEntity;

  constructor(home: Home, state: HassEntity) {
    this.home = home;
    this.hassState = state;
  }

  // Home

  get uniqueIdentifier(): string {
    return this.hassState.entity_id;
  }

  get localizedDescription(): string {
    return this.hassState.attributes.friendly_name || '';
  }

  get characteristicType(): string {
    return this.hassState.attributes.device_class || '';
  }

  get units(): string | void {
    return this.hassState.attributes.unit_of_measurement;
  }
}
