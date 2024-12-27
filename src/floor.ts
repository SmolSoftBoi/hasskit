import { Zone } from '@smolpack/home-types';
import Home from './home';
import { HassFloorRegistryEntry } from './types/hass';

export default class Floor implements Zone {
  home: Home;
  hassFloor: HassFloorRegistryEntry;

  constructor(home: Home, floor: HassFloorRegistryEntry) {
    this.home = home;
    this.hassFloor = floor;
  }
}
